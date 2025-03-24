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

      // Create a FormData object for the multipart request (required for file uploads)
      const formDataPayload = new FormData();

      // Create a more informative message now that we're only using Discord
      const discordMessage = `**NEW APPLICATION**
Role: ${roleData.name}
Department: ${roleData.department}
Applicant: ${formData.discord_username} (${formData.discord_id})
Timestamp: ${timestamp}`;

      // Add the more detailed message in payload JSON
      formDataPayload.append(
        'payload_json',
        JSON.stringify({
          content: discordMessage,
        })
      );

      // Create a file from the JSON string and attach it
      const file = new File([jsonString], fileName, {
        type: 'application/json',
      });
      formDataPayload.append('file', file);

      // Send to Discord webhook
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        body: formDataPayload,
      });

      if (!response.ok) {
        throw new Error(
          `Discord webhook error: ${response.status} ${response.statusText}`
        );
      }

      // Success!
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
}

export async function POST(
  req: NextRequest,
  context: { params: { role: string } }
) {
  try {
    // Get role and questions
    const roleSlug = context.params.role;
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

    // Create timestamp for this submission
    const timestamp = new Date().toISOString();

    // Flag to track if initial backup was sent successfully
    let initialBackupSent = false;

    // Store backup of submission in Discord (instead of files)
    try {
      // Send backup to Discord webhook immediately with retries
      initialBackupSent = await sendToDiscordWebhook(
        roleData,
        formObject,
        timestamp
      );
    } catch (_backupError) {
      // Log backup error but continue - this doesn't need to block the response
      console.error('Error creating initial backup:', _backupError);
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

    // Immediately return success response
    return NextResponse.json({
      success: true,
      message: 'Application received',
    });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'Server error processing the application' },
      { status: 500 }
    );
  }
}
