import { NextRequest, NextResponse } from 'next/server';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import { ApiClient } from '@mondaydotcomorg/api';

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
  data: {
    boards: Board[];
  };
};

type CreateItemResponse = {
  data: {
    create_item: {
      id: string;
      name: string;
      board: {
        id: string;
        name: string;
      };
    };
  };
};

type CreateDocResponse = {
  data: {
    create_doc: {
      id: string;
      object_id: string;
    };
  };
};

// Define a type for form data
type FormData = {
  discord_username: string;
  discord_id: string;
  [key: string]: string;
};

type CreateDocBlockResult = {
  data: {
    create_doc_block: {
      id: string;
      type: string;
    };
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

// Define Role type to replace 'any'
type Role = {
  name: string;
  slug: string;
  department: string;
  description: string;
  questions: Question[];
};

// Helper function to get environment variables safely
function getEnvVar(key: string): string {
  // Try to get from process.env first
  const value = process.env[key];
  if (value) return value;

  // If not found, try to get from Cloudflare environment
  // @ts-expect-error - Cloudflare Workers specific global
  if (typeof env !== 'undefined' && env[key]) {
    // @ts-expect-error - Cloudflare Workers specific global
    return env[key];
  }

  return '';
}

// Helper function to store application data in GitHub
async function storeApplicationDataOnGitHub(
  roleData: Role,
  formData: FormData,
  timestamp: string
) {
  try {
    const githubToken = getEnvVar('GITHUB_TOKEN');
    if (!githubToken) {
      console.log('GitHub token not configured, skipping GitHub storage');
      return false;
    }

    console.log('Attempting to store application data on GitHub...');

    const repoOwner = getEnvVar('GITHUB_REPO_OWNER') || 'allthingslinux';
    const repoName = getEnvVar('GITHUB_REPO_NAME') || 'applications';

    // Create application data object
    const applicationData = {
      timestamp,
      role: {
        name: roleData.name,
        slug: roleData.slug,
        department: roleData.department,
        description: roleData.description,
      },
      applicant: {
        discord_username: formData.discord_username,
        discord_id: formData.discord_id,
      },
      // Include all form data organized by questions
      generalAnswers: generalQuestions
        .filter((q: Question) => formData[q.name])
        .map((q: Question) => ({
          question: q.question,
          answer: formData[q.name],
          name: q.name,
          optional: q.optional || false,
        })),
      roleAnswers: roleData.questions
        .filter((q: Question) => formData[q.name])
        .map((q: Question) => ({
          question: q.question,
          answer: formData[q.name],
          name: q.name,
          optional: q.optional || false,
        })),
      // Include simplified form data for complete backup
      rawFormData: Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, String(value)])
      ),
    };

    // Format timestamp for filename
    const safeTimestamp = timestamp.replace(/[:.]/g, '-');
    const safeUsername = formData.discord_username.replace(/[^a-z0-9]/gi, '_');
    const filename = `applications/${roleData.slug}/${safeUsername}-${safeTimestamp}.json`;
    const content = JSON.stringify(applicationData, null, 2);

    // Cloudflare Workers compatible Base64 encoding
    // First convert the string to UTF-8 bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    // Then encode those bytes to base64
    let contentEncoded = '';
    try {
      // Try the modern approach first (supported in most environments)
      contentEncoded = btoa(
        Array.from(data)
          .map((byte) => String.fromCharCode(byte))
          .join('')
      );
    } catch (encodeError) {
      console.error(
        'Error with btoa encoding, trying Buffer fallback:',
        encodeError
      );

      // Fallback for environments that support Buffer
      try {
        contentEncoded = Buffer.from(content).toString('base64');
      } catch (bufferError) {
        console.error('Buffer fallback also failed:', bufferError);
        throw new Error('Unable to base64 encode content');
      }
    }

    console.log(`Attempting to create file: ${filename}`);

    // Create the file via GitHub API - using the safe variables
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Cloudflare-Worker',
        },
        body: JSON.stringify({
          message: `Application submission: ${roleData.name} - ${formData.discord_username}`,
          content: contentEncoded,
          branch: 'main',
        }),
      }
    );

    console.log(`GitHub API response status: ${response.status}`);

    if (!response.ok) {
      const responseData = await response.json();
      console.error('GitHub API error details:', JSON.stringify(responseData));
      throw new Error(
        `GitHub API error: ${response.status} - ${JSON.stringify(responseData)}`
      );
    }

    console.log(`Successfully stored application in GitHub at ${filename}`);
    return true;
  } catch (error) {
    console.error('Error storing application data on GitHub:', error);
    return false;
  }
}

// Helper function to send application data to Discord webhook with retries
async function sendToDiscordWebhook(
  roleData: Role,
  formData: FormData,
  timestamp: string,
  maxRetries = 3
) {
  try {
    const webhookUrl = getEnvVar('DISCORD_WEBHOOK_URL');
    if (!webhookUrl) {
      console.log('Discord webhook URL not configured, skipping backup');
      return false;
    }

    // Track retries
    let retryCount = 0;
    let lastError: Error | null = null;

    // Retry loop
    while (retryCount <= maxRetries) {
      try {
        // Create a complete backup JSON file with all data
        const backupData = {
          timestamp: timestamp,
          application: {
            role: {
              name: roleData.name,
              slug: roleData.slug,
              department: roleData.department,
              description: roleData.description,
            },
            applicant: {
              discord_username: formData.discord_username,
              discord_id: formData.discord_id,
            },
            // Include all form data organized by questions
            generalAnswers: generalQuestions
              .filter((q: Question) => formData[q.name])
              .map((q: Question) => ({
                question: q.question,
                answer: formData[q.name],
                name: q.name,
                optional: q.optional || false,
              })),
            roleAnswers: roleData.questions
              .filter((q: Question) => formData[q.name])
              .map((q: Question) => ({
                question: q.question,
                answer: formData[q.name],
                name: q.name,
                optional: q.optional || false,
              })),
            // Include raw form data for complete backup
            rawFormData: formData,
          },
        };

        // Stringify the JSON data with nice formatting
        const jsonString = JSON.stringify(backupData, null, 2);

        // First send a simple header message - using the safe variable
        const headerResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `**NEW APPLICATION**\nRole: ${roleData.name}\nDepartment: ${roleData.department}\nApplicant: ${formData.discord_username} (${formData.discord_id})\nTimestamp: ${timestamp}`,
          }),
        });

        if (!headerResponse.ok) {
          throw new Error(
            `Discord webhook error: ${headerResponse.status} ${headerResponse.statusText}`
          );
        }

        // Split the JSON data into manageable chunks for Discord
        const chunkSize = 1950; // Leave room for markdown code block syntax
        const chunks = [];

        for (let i = 0; i < jsonString.length; i += chunkSize) {
          chunks.push(jsonString.substring(i, i + chunkSize));
        }

        // Send each chunk as a code block - using the safe variable
        for (let i = 0; i < chunks.length; i++) {
          const chunkResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: `**Application Data (Part ${i + 1}/${chunks.length})**\n\`\`\`json\n${chunks[i]}\n\`\`\``,
            }),
          });

          if (!chunkResponse.ok) {
            console.warn(
              `Failed to send data chunk ${i + 1}: ${chunkResponse.status}`
            );
          }

          // Add a small delay between chunk messages to avoid rate limiting
          if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        console.log('Successfully sent application data to Discord webhook');
        return true;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(
          `Error sending to Discord webhook (attempt ${retryCount + 1}/${maxRetries + 1}):`,
          error
        );

        // If we've reached max retries, break out of the loop
        if (retryCount >= maxRetries) {
          break;
        }

        // Exponential backoff for retry
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));

        // Increment retry counter
        retryCount++;
      }
    }

    // If we reach here, all retries failed
    console.error(
      `All ${maxRetries + 1} attempts to send Discord webhook failed:`,
      lastError
    );
    return false;
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
    return false;
  }
}

// Helper function to store application data in Monday.com
async function storeApplicationInMonday(
  monday: ApiClient,
  roleData: Role,
  formData: FormData,
  timestamp: string
) {
  try {
    const boardId = getEnvVar('MONDAY_BOARD_ID');
    if (!boardId) {
      console.log(
        'Monday.com board ID not configured, skipping Monday storage'
      );
      return false;
    }

    console.log('Attempting to store application in Monday.com...');

    // Get board columns to understand the structure
    const columnsQuery = `query {
      boards(ids: [${boardId}]) {
        columns {
          id
          title
          type
          settings_str
        }
      }
    }`;

    const columnsResponse =
      await monday.request<GetColumnsResponse>(columnsQuery);
    const columns = columnsResponse.data.boards[0]?.columns || [];

    // Create the main item in Monday.com
    const itemName = `${roleData.name} - ${formData.discord_username}`;
    const createItemQuery = `mutation {
      create_item (
        board_id: ${boardId},
        item_name: "${itemName}",
        column_values: ${JSON.stringify(
          JSON.stringify({
            status: { label: 'New' },
            text: formData.discord_username,
            text1: formData.discord_id,
            date4: new Date(timestamp).toISOString().split('T')[0],
            dropdown: roleData.department,
          })
        )}
      ) {
        id
        name
        board {
          id
          name
        }
      }
    }`;

    const itemResponse =
      await monday.request<CreateItemResponse>(createItemQuery);
    const itemId = itemResponse.data.create_item.id;

    // Create a detailed doc with all application information
    const createDocQuery = `mutation {
      create_doc(
        item_id: ${itemId},
        name: "Application Details"
      ) {
        id
        object_id
      }
    }`;

    const docResponse = await monday.request<CreateDocResponse>(createDocQuery);
    const docId = docResponse.data.create_doc.id;

    // Format application data for the doc
    const docContent = [
      { title: 'Application Details', type: 'h1' },
      { text: `Submitted: ${timestamp}`, type: 'p' },
      { title: 'Role Information', type: 'h2' },
      { text: `Name: ${roleData.name}`, type: 'p' },
      { text: `Department: ${roleData.department}`, type: 'p' },
      { text: `Description: ${roleData.description}`, type: 'p' },
      { title: 'Applicant Information', type: 'h2' },
      { text: `Discord Username: ${formData.discord_username}`, type: 'p' },
      { text: `Discord ID: ${formData.discord_id}`, type: 'p' },
      { title: 'General Questions', type: 'h2' },
      ...generalQuestions
        .filter((q: Question) => formData[q.name])
        .map((q: Question) => [
          { text: q.question, type: 'h3' },
          { text: formData[q.name], type: 'p' },
        ])
        .flat(),
      { title: 'Role-Specific Questions', type: 'h2' },
      ...roleData.questions
        .filter((q: Question) => formData[q.name])
        .map((q: Question) => [
          { text: q.question, type: 'h3' },
          { text: formData[q.name], type: 'p' },
        ])
        .flat(),
    ];

    // Add each block to the doc
    for (const block of docContent) {
      const createBlockQuery = `mutation {
        create_doc_block(
          doc_id: ${docId},
          type: "${block.type}",
          content: ${JSON.stringify(JSON.stringify({ text: block.text || block.title }))}
        ) {
          id
          type
        }
      }`;

      const blockResponse =
        await monday.request<CreateDocBlockResult>(createBlockQuery);
      // No need to check blockResponse since we only care if it succeeds
    }

    console.log('Successfully stored application in Monday.com');
    return true;
  } catch (error) {
    console.error('Error storing application in Monday.com:', error);
    return false;
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { role: string } }
) {
  try {
    console.log('POST request received for application submission');

    // Log environment variables
    console.log('Environment variables in API route:');
    console.log(
      'DISCORD_WEBHOOK_URL:',
      getEnvVar('DISCORD_WEBHOOK_URL') ? '✓ Set' : '✗ Not set'
    );
    console.log(
      'GITHUB_TOKEN:',
      getEnvVar('GITHUB_TOKEN') ? '✓ Set' : '✗ Not set'
    );
    console.log(
      'GITHUB_REPO_OWNER:',
      getEnvVar('GITHUB_REPO_OWNER') || 'allthingslinux'
    );
    console.log(
      'GITHUB_REPO_NAME:',
      getEnvVar('GITHUB_REPO_NAME') || 'applications'
    );
    console.log(
      'MONDAY_API_KEY:',
      getEnvVar('MONDAY_API_KEY') ? '✓ Set' : '✗ Not set'
    );
    console.log(
      'MONDAY_BOARD_ID:',
      getEnvVar('MONDAY_BOARD_ID') ? '✓ Set' : '✗ Not set'
    );

    // Initialize Monday client if API key exists
    let monday: ApiClient | null = null;
    const mondayApiKey = getEnvVar('MONDAY_API_KEY');
    if (mondayApiKey) {
      try {
        monday = new ApiClient({ token: mondayApiKey });
      } catch (mondayError) {
        console.error('Error initializing Monday client:', mondayError);
      }
    }

    // Get role and questions
    const roleSlug = context.params.role;
    console.log(`Processing application for role: ${roleSlug}`);

    const roleData = roles.find((r) => r.slug === roleSlug);

    if (!roleData) {
      console.error(`Invalid role slug: ${roleSlug}`);
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Combine general and role-specific questions
    const allQuestions = [...generalQuestions, ...roleData.questions];
    console.log(`Total questions to process: ${allQuestions.length}`);

    // Process form data
    let formData;
    try {
      formData = await req.formData();
      console.log('Form data successfully parsed');
    } catch (formError) {
      console.error('Error parsing form data:', formError);
      return NextResponse.json(
        { error: 'Could not parse form data' },
        { status: 400 }
      );
    }

    const formObject = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        value.toString(),
      ])
    ) as FormData;

    console.log(`Processed ${Object.keys(formObject).length} form fields`);

    // Validate required fields
    const requiredFields = ['discord_username', 'discord_id'];
    const missingFields = requiredFields.filter((field) => !formObject[field]);

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify all required questions have answers, handling conditional fields
    const unansweredRequiredQuestions = allQuestions
      .filter((q) => {
        // Skip validation for fields that end with "_other" if their parent field doesn't have "other" selected
        if (q.name.endsWith('_other')) {
          // Extract the parent field name (remove _other suffix)
          const parentFieldName = q.name.replace('_other', '');

          // Check if parent field exists and doesn't have "other" selected
          const parentValue = formObject[parentFieldName];

          // If parent value doesn't contain "other", this field is not required
          if (parentValue && !parentValue.toLowerCase().includes('other')) {
            return false;
          }
        }

        // Regular required field validation
        return !q.optional && !formObject[q.name];
      })
      .map((q) => q.name);

    if (unansweredRequiredQuestions.length > 0) {
      console.error(
        `Missing answers for required questions: ${unansweredRequiredQuestions.join(', ')}`
      );
      return NextResponse.json(
        {
          error: `Missing answers for required questions: ${unansweredRequiredQuestions.join(
            ', '
          )}`,
        },
        { status: 400 }
      );
    }

    // Create timestamp for this submission
    const timestamp = new Date().toISOString();
    console.log(`Application timestamp: ${timestamp}`);

    // Flag to track if initial backup was sent successfully
    let initialBackupSent = false;
    let githubStorageSuccess = false;

    // Log environment status for debugging with additional safety checks
    const discordWebhookConfigured = !!(
      getEnvVar('DISCORD_WEBHOOK_URL') ||
      getEnvVar('NEXT_PUBLIC_DISCORD_WEBHOOK_URL')
    );
    const githubTokenConfigured = !!(
      getEnvVar('GITHUB_TOKEN') || getEnvVar('NEXT_PUBLIC_GITHUB_TOKEN')
    );

    console.log(`Discord webhook configured: ${discordWebhookConfigured}`);
    console.log(`GitHub token configured: ${githubTokenConfigured}`);
    console.log(`Monday.com API client initialized: ${!!monday}`);

    // Store application data in GitHub
    try {
      githubStorageSuccess = await storeApplicationDataOnGitHub(
        roleData,
        formObject,
        timestamp
      );
      console.log(`GitHub storage success: ${githubStorageSuccess}`);
    } catch (githubError) {
      console.error('Error storing application in GitHub:', githubError);
      githubStorageSuccess = false;
    }

    // Store backup of submission in Discord
    try {
      console.log('Attempting to send application data to Discord webhook');
      // Send backup to Discord webhook immediately with retries
      initialBackupSent = await sendToDiscordWebhook(
        roleData,
        formObject,
        timestamp
      );
      console.log(`Discord webhook success: ${initialBackupSent}`);
    } catch (backupError) {
      // Log backup error but continue - this doesn't need to block the response
      console.error('Error creating initial backup:', backupError);
      initialBackupSent = false;
    }

    // Define the background processing function
    const processFormInBackground = async () => {
      // If initial GitHub storage failed, try again in the background
      if (!githubStorageSuccess) {
        try {
          console.log('Retrying GitHub storage in background process...');
          await storeApplicationDataOnGitHub(roleData, formObject, timestamp);
        } catch (retryError) {
          console.error('Retry of GitHub storage also failed:', retryError);
        }
      }

      // If initial backup failed, try one more time immediately in the background process
      if (!initialBackupSent) {
        try {
          console.log('Retrying initial backup in background process...');
          await sendToDiscordWebhook(
            roleData,
            formObject,
            timestamp,
            5 // More retries
          );
        } catch (retryError) {
          console.error('Retry of initial backup also failed:', retryError);
        }
      }

      // Store application in Monday.com if client is initialized
      if (monday) {
        try {
          console.log('Attempting to store application in Monday.com...');
          await storeApplicationInMonday(
            monday,
            roleData,
            formObject,
            timestamp
          );
        } catch (mondayError) {
          console.error(
            'Error storing application in Monday.com:',
            mondayError
          );
        }
      } else {
        console.log('Monday.com client not initialized, skipping integration');
      }
    };

    // Start background processing but don't await it
    processFormInBackground();

    console.log(
      'Successfully processed application, returning success response'
    );
    // Immediately return success response
    return NextResponse.json({
      success: true,
      message: 'Application received',
    });
  } catch (error) {
    // Detailed error logging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    console.error('Unhandled error processing application:');
    console.error(`Message: ${errorMessage}`);
    console.error(`Stack: ${errorStack}`);

    return NextResponse.json(
      {
        error: 'Server error processing the application',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
