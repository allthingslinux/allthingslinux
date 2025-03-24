import { NextRequest, NextResponse } from 'next/server';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import { ApiClient } from '@mondaydotcomorg/api';

// Conditionally initialize Monday.com API client
let monday: ApiClient | null = null;
if (process.env.MONDAY_API_KEY) {
  monday = new ApiClient({
    token: process.env.MONDAY_API_KEY,
  });
}

// Define Discord webhook URL from environment variable
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

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

// Define Role type to replace 'any'
type Role = {
  name: string;
  slug: string;
  department: string;
  description: string;
  questions: Question[];
};

// Helper function to send application data to Discord webhook with retries
async function sendToDiscordWebhook(
  roleData: Role,
  formData: FormData,
  timestamp: string,
  maxRetries = 3
) {
  if (!DISCORD_WEBHOOK_URL) {
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

      // Create a unique filename with role, username and timestamp
      const fileName = `application-${roleData.slug}-${formData.discord_username.replace(/[^a-z0-9]/gi, '_')}-${timestamp.replace(/[:.]/g, '-')}.json`;

      // Create the discord message
      const discordMessage = `**NEW APPLICATION**
Role: ${roleData.name}
Department: ${roleData.department}
Applicant: ${formData.discord_username} (${formData.discord_id})
Timestamp: ${timestamp}`;

      // Try multipart upload first
      try {
        console.log('Trying multipart upload to Discord webhook...');

        // Cloudflare Workers compatible approach for multipart/form-data
        const boundary = `----FormBoundary${Math.random().toString(16).substr(2)}`;

        // Build multipart form-data manually
        const parts = [
          // Add the JSON payload part
          `--${boundary}\r\n`,
          `Content-Disposition: form-data; name="payload_json"\r\n`,
          `Content-Type: application/json\r\n\r\n`,
          `${JSON.stringify({ content: discordMessage })}\r\n`,

          // Add the file part
          `--${boundary}\r\n`,
          `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`,
          `Content-Type: application/json\r\n\r\n`,
          `${jsonString}\r\n`,

          // End boundary
          `--${boundary}--\r\n`,
        ];

        // Convert parts array to Uint8Array for compatibility
        const encoder = new TextEncoder();
        const formDataString = parts.join('');
        const formDataBytes = encoder.encode(formDataString);

        // Send to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body: formDataBytes,
        });

        if (response.ok) {
          console.log('Multipart upload to Discord webhook succeeded');
          return true;
        }

        throw new Error(
          `Discord webhook error: ${response.status} ${response.statusText}`
        );
      } catch (multipartError) {
        console.error(
          'Multipart upload failed, trying fallback method:',
          multipartError
        );

        // Fallback: Send message-only without file attachment
        // This is more likely to work in limited environments
        const fallbackResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `${discordMessage}\n\n**APPLICATION DATA (JSON):**\n\`\`\`json\n${jsonString.substring(0, 1500)}...\n\`\`\``,
          }),
        });

        if (!fallbackResponse.ok) {
          throw new Error(
            `Discord fallback webhook error: ${fallbackResponse.status} ${fallbackResponse.statusText}`
          );
        }

        console.log('Fallback Discord webhook method succeeded');
        return true;
      }
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
}

export async function POST(
  req: NextRequest,
  context: { params: { role: string } }
) {
  try {
    console.log('POST request received for application submission');

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

    // Log environment status for debugging
    console.log(`Discord webhook configured: ${!!DISCORD_WEBHOOK_URL}`);
    console.log(`Monday.com API client initialized: ${!!monday}`);

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
      // If initial backup failed, try one more time immediately in the background process
      if (!initialBackupSent) {
        try {
          console.log('Retrying initial backup in background process...');
          await sendToDiscordWebhook(roleData, formObject, timestamp, 5); // More retries
        } catch (retryError) {
          console.error('Retry of initial backup also failed:', retryError);
        }
      }

      // Skip Monday.com integration entirely
      console.log('Skipping Monday.com integration as requested');
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
