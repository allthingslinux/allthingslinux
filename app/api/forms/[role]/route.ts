import { NextRequest, NextResponse } from 'next/server';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import { ApiClient } from '@mondaydotcomorg/api';
import { promises as fs } from 'fs';
import path from 'path';

const monday = new ApiClient({
  token: process.env.MONDAY_API_KEY!,
});

// Define types needed for Monday.com API interactions
type Column = {
  id: string;
  title: string;
  type: string;
  settings_str: string;
};

type Board = {
  id: string;
  name: string;
  columns: Column[];
};

type GetColumnsResponse = {
  boards: Board[];
};

type CreateItemResponse = {
  create_item: {
    id: string;
    name: string;
    board: {
      id: string;
      name: string;
    };
  };
};

type CreateDocResponse = {
  create_doc: {
    id: string;
    object_id: string;
  };
};

// Define a type for form data
type FormData = {
  discord_username: string;
  discord_id: string;
  [key: string]: string;
};

type CreateDocBlockResult = {
  create_doc_block: {
    id: string;
    type: string;
  };
};

// Define the Question type based on what's used in the code
type Question = {
  name: string;
  question: string;
  optional?: boolean;
  type?: string;
  description?: string;
  options?: string[];
};

export const runtime = 'edge';

export async function POST(
  req: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    // Get role and questions
    const roleSlug = (await params).role;
    const roleData = roles.find((r) => r.slug === roleSlug);

    if (!roleData) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Combine general and role-specific questions
    const allQuestions = [...generalQuestions, ...roleData.questions];

    // Process form data
    const formData = await req.formData();
    const formObject = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        value.toString(),
      ])
    ) as FormData;

    // Validate required fields
    const requiredFields = ['discord_username', 'discord_id'];
    const missingFields = requiredFields.filter((field) => !formObject[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify all required questions have answers
    const unansweredRequiredQuestions = allQuestions
      .filter((q) => !q.optional && !formObject[q.name])
      .map((q) => q.name);

    if (unansweredRequiredQuestions.length > 0) {
      return NextResponse.json(
        {
          error: `Missing answers for required questions: ${unansweredRequiredQuestions.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    // Store the form data in a backup file before processing
    const backupData = {
      timestamp: new Date().toISOString(),
      role: roleData,
      formData: formObject,
      processed: false,
    };

    // Create a unique filename based on timestamp and discord ID
    const backupDir = path.join(process.cwd(), 'form-backups');
    const fileName = `${new Date().toISOString().replace(/[:.]/g, '-')}-${formObject.discord_id}.json`;
    const backupFilePath = path.join(backupDir, fileName);

    try {
      // Ensure backup directory exists
      await fs.mkdir(backupDir, { recursive: true });
      // Write backup file
      await fs.writeFile(backupFilePath, JSON.stringify(backupData, null, 2));
    } catch (_backupError) {
      // Log backup error but continue - this doesn't need to block the response
      // In production, you'd want to alert on this failure
    }

    // Define the background processing function
    const processFormInBackground = async () => {
      try {
        // First, get current dropdown settings
        const columnsQuery = `query {
          boards(ids: ["${process.env.MONDAY_BOARD_ID}"]) {
            id
            name
            columns {
              id
              title
              type
              settings_str
            }
          }
        }`;

        let currentSettings: Column[] = [];
        try {
          const columnsResult =
            await monday.request<GetColumnsResponse>(columnsQuery);

          if (!columnsResult.boards) {
            throw new Error(
              'Invalid response from Monday.com API - no boards array'
            );
          }

          if (columnsResult.boards.length === 0) {
            throw new Error(
              `No board found with ID ${process.env.MONDAY_BOARD_ID}. Please check the board ID and API token permissions.`
            );
          }

          if (!columnsResult.boards[0].columns) {
            throw new Error(
              `Board ${process.env.MONDAY_BOARD_ID} has no columns`
            );
          }

          currentSettings = columnsResult.boards[0].columns;

          // Verify required columns exist
          const requiredColumns = [
            { id: 'color_mkp2nrgz', name: 'Status' },
            { id: 'dropdown_mkp22pcr', name: 'Role' },
            { id: 'dropdown_mkp2n3v9', name: 'Department' },
            { id: 'date4', name: 'Date' },
            { id: 'text_mkp2jfrq', name: 'Discord Username' },
            { id: 'text_mkp2d8wc', name: 'Discord ID' },
          ];

          for (const col of requiredColumns) {
            if (!currentSettings.find((c) => c.id === col.id)) {
              throw new Error(
                `Required column ${col.name} (${col.id}) not found in board`
              );
            }
          }
        } catch (_error) {
          // Log error but don't terminate the process
          // Since we're in the background, we can't return an HTTP response
          return;
        }

        // Only proceed if we have the columns
        if (currentSettings.length === 0) {
          return;
        }

        // Create item in Monday.com with create_labels_if_missing
        const docTitle = `${roleData.name} Application - ${formObject.discord_username}`;

        const columnValues = {
          color_mkp2nrgz: { index: 5 }, // "Needs Review" has index 5 in the settings
          dropdown_mkp22pcr: { labels: [roleData.name] },
          dropdown_mkp2n3v9: { labels: [roleData.department] },
          date4: { date: new Date().toISOString().split('T')[0] },
          text_mkp2jfrq: formObject.discord_username,
          text_mkp2d8wc: formObject.discord_id,
          name: docTitle, // Set the name directly during creation
        };

        const createItemVars = {
          boardId: String(process.env.MONDAY_BOARD_ID),
          itemName: docTitle, // Use full title immediately instead of just username
          columnValues: JSON.stringify(columnValues),
        };

        const createItemQuery = `mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
          create_item (
            board_id: $boardId,
            item_name: $itemName,
            column_values: $columnValues,
            create_labels_if_missing: true
          ) {
            id
            name
            board {
              id
              name
            }
          }
        }`;

        let itemResult;
        try {
          itemResult = await monday.request<CreateItemResponse>(
            createItemQuery,
            createItemVars
          );
        } catch (_error) {
          return;
        }

        if (!itemResult?.create_item?.id) {
          return;
        }

        // Create a doc in Monday.com
        const createDocQuery = `mutation createDoc($itemId: ID!, $columnId: String!) {
          create_doc(
            location: {
              board: {
                item_id: $itemId,
                column_id: $columnId
              }
            }
          ) {
            id
            object_id
          }
        }`;

        const createDocVars = {
          itemId: itemResult.create_item.id,
          columnId: 'doc_mkp2k5rr',
        };

        let docResult;
        try {
          docResult = await monday.request<CreateDocResponse>(
            createDocQuery,
            createDocVars
          );
        } catch (_error) {
          return;
        }

        if (!docResult?.create_doc?.id) {
          return;
        }

        // Skip document metadata update and separate name update since we've set the name during creation

        // Create blocks for title and grouped questions/answers to reduce API calls
        const blocks = [];

        // Add title block
        blocks.push({
          type: 'large_title',
          content: {
            deltaFormat: [
              {
                insert: `${docTitle}\n`,
              },
            ],
            alignment: 'left',
            direction: 'ltr',
          },
        });

        // Group questions by sections to reduce API calls
        // Process general questions
        if (generalQuestions.some((q) => formObject[q.name])) {
          // Add section title first
          blocks.push({
            type: 'medium_title',
            content: {
              deltaFormat: [
                {
                  insert: 'General Information\n',
                },
              ],
              alignment: 'left',
              direction: 'ltr',
            },
          });

          // Then add section content
          const generalContent = processQuestionsContent(
            generalQuestions,
            formObject
          );
          if (generalContent) {
            blocks.push(generalContent);
          }
        }

        // Process role-specific questions
        if (roleData.questions.some((q) => formObject[q.name])) {
          // Add section title first
          blocks.push({
            type: 'medium_title',
            content: {
              deltaFormat: [
                {
                  insert: `${roleData.name} Specific Questions\n`,
                },
              ],
              alignment: 'left',
              direction: 'ltr',
            },
          });

          // Then add section content
          const roleContent = processQuestionsContent(
            roleData.questions,
            formObject
          );
          if (roleContent) {
            blocks.push(roleContent);
          }
        }

        // Process blocks with proper typing and optimized rate limit handling
        let retryCount = 0;
        const MAX_RETRIES = 5;
        let currentDelay = 2000; // Start with 2 second delay
        let previousBlockId: string | null = null;

        // Helper function to process content of questions (without headers)
        function processQuestionsContent(
          questionsList: Question[],
          formData: FormData
        ) {
          const answeredQuestions = questionsList.filter(
            (q) => formData[q.name]
          );

          if (answeredQuestions.length === 0) {
            return null;
          }

          // Build content with clear visual formatting
          let content = '';

          // Add each question and answer with spacing for clarity
          for (const question of answeredQuestions) {
            const value = formData[question.name];
            // Use uppercase for questions to make them stand out
            content += `${question.question.toUpperCase()}\n\n${value.toString()}\n\n`;
          }

          return {
            type: 'normal_text',
            content: {
              deltaFormat: [
                {
                  insert: content,
                },
              ],
              alignment: 'left',
              direction: 'ltr',
            },
          };
        }

        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];

          const createBlockQuery = `mutation createDocBlock(
            $docId: ID!,
            $type: DocBlockContentType!,
            $content: JSON!,
            $afterBlockId: String
          ) {
            create_doc_block(
              doc_id: $docId,
              type: $type,
              content: $content
              after_block_id: $afterBlockId
            ) {
              id
            }
          }`;

          type CreateBlockVariables = {
            docId: string;
            type: 'large_title' | 'medium_title' | 'normal_text';
            content: string; // Content must be stringified JSON
            afterBlockId: string | null;
          };

          const variables: CreateBlockVariables = {
            docId: docResult.create_doc.id,
            type: block.type as CreateBlockVariables['type'],
            content: JSON.stringify(block.content),
            afterBlockId: previousBlockId || null,
          };

          try {
            // Add a delay before each request to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, currentDelay));

            const blockResult: CreateDocBlockResult = await monday.request(
              createBlockQuery,
              variables
            );

            // Store this block's ID to position the next block after it
            previousBlockId = blockResult.create_doc_block.id;

            // Success - gradually reduce delay if we're being too cautious
            if (currentDelay > 2000 && retryCount === 0) {
              currentDelay = Math.max(currentDelay * 0.8, 2000); // Gradually reduce delay but not below 2 seconds
            }
            retryCount = 0;
          } catch (error: unknown) {
            const mondayError = error as {
              response?: {
                errors?: Array<{
                  extensions?: {
                    code?: string;
                    retry_in_seconds?: number;
                    complexity?: {
                      before?: number;
                      after?: number;
                      query?: number;
                    };
                  };
                  message?: string;
                }>;
              };
            };
            const errorCode =
              mondayError?.response?.errors?.[0]?.extensions?.code;

            // Handle different types of rate limits
            if (
              errorCode === 'COMPLEXITY_BUDGET_EXHAUSTED' ||
              errorCode === 'RATE_LIMIT_EXCEEDED' ||
              errorCode === 'CONCURRENCY_LIMIT_EXCEEDED' ||
              errorCode === 'IP_RATE_LIMIT_EXCEEDED'
            ) {
              retryCount++;
              if (retryCount > MAX_RETRIES) {
                throw error;
              }

              // Extract retry delay with better fallbacks
              const retryIn =
                mondayError?.response?.errors?.[0]?.extensions
                  ?.retry_in_seconds || Math.min(30 * 2 ** retryCount, 300); // Exponential backoff with 5 minute max

              // More aggressive backoff strategy for repeated failures
              currentDelay = Math.min(
                currentDelay * (1 + retryCount * 0.5),
                60000
              ); // Cap at 1 minute

              await new Promise((resolve) =>
                setTimeout(resolve, retryIn * 1000)
              );
              // Retry this block
              i--;
              continue;
            }

            // For other errors, throw immediately
            throw error;
          }
        }

        // At the end of successful processing, mark the backup as processed
        try {
          const updatedBackup = { ...backupData, processed: true };
          await fs.writeFile(
            backupFilePath,
            JSON.stringify(updatedBackup, null, 2)
          );
        } catch (_error) {
          // Just log the error, don't interrupt the flow
        }
      } catch (error) {
        // Just log the error and continue since we're in the background
        // We could store the error in a database or send to an error tracking service
        try {
          // Update the backup file with the error information
          const updatedBackup = {
            ...backupData,
            error: error instanceof Error ? error.message : 'Unknown error',
            errorTimestamp: new Date().toISOString(),
          };
          await fs.writeFile(
            backupFilePath,
            JSON.stringify(updatedBackup, null, 2)
          );
        } catch (_writeError) {
          // Failed to update backup file
        }
      }
    };

    // Start the background processing without awaiting completion
    processFormInBackground().catch((_error) => {
      // Optional: send to error monitoring service
    });

    // Return success immediately so the client can redirect
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully. Processing in background.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to submit application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
