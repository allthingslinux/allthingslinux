import { NextRequest, NextResponse } from 'next/server';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import type { FormData, Role } from '@/lib/types';
import { storeApplicationDataOnGitHub } from '@/lib/integrations/github';
import { sendToDiscordWebhook } from '@/lib/integrations/discord';
import { storeApplicationInMonday } from '@/lib/integrations/monday-graphql';

export async function POST(
  req: NextRequest,
  context: { params: { role: string } }
) {
  try {
    console.log('POST request received for application submission');

    // Log environment variables in API route:
    console.log('Environment variables in API route:');
    console.log(
      'DISCORD_WEBHOOK_URL:',
      process.env.DISCORD_WEBHOOK_URL ? '✓ Set' : '✗ Not set'
    );
    console.log(
      'GITHUB_TOKEN:',
      process.env.GITHUB_TOKEN ? '✓ Set' : '✗ Not set'
    );
    console.log(
      'GITHUB_REPO_OWNER:',
      process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER || 'allthingslinux'
    );
    console.log(
      'GITHUB_REPO_NAME:',
      process.env.NEXT_PUBLIC_GITHUB_REPO_NAME || 'applications'
    );
    console.log(
      'MONDAY_API_KEY:',
      process.env.MONDAY_API_KEY ? '✓ Set' : '✗ Not set'
    );
    console.log(
      'MONDAY_BOARD_ID:',
      process.env.MONDAY_BOARD_ID ? '✓ Set' : '✗ Not set'
    );

    // Get role and questions
    const roleSlug = context.params.role;
    console.log(`Processing application for role: ${roleSlug}`);

    const roleData = roles.find((r) => r.slug === roleSlug);

    if (!roleData) {
      console.error(`Invalid role slug: ${roleSlug}`);
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Debug log for department value
    console.log(
      `Role data: name=${roleData.name}, department=${roleData.department}`
    );

    // Add general questions to the role data for integration modules
    const roleWithGeneralQuestions = {
      ...roleData,
      generalQuestions: generalQuestions,
    } as Role;

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
    const discordWebhookConfigured = !!process.env.DISCORD_WEBHOOK_URL;
    const githubTokenConfigured = !!process.env.GITHUB_TOKEN;
    const mondayConfigured =
      !!process.env.MONDAY_API_KEY && !!process.env.MONDAY_BOARD_ID;

    console.log(`Discord webhook configured: ${discordWebhookConfigured}`);
    console.log(`GitHub token configured: ${githubTokenConfigured}`);
    console.log(`Monday.com configured: ${mondayConfigured}`);

    // Process all integrations sequentially
    try {
      console.log('Starting integrations processing...');

      // 1. GitHub Storage
      if (githubTokenConfigured) {
        console.log('Attempting to store application in GitHub...');
        githubStorageSuccess = await storeApplicationDataOnGitHub(
          roleWithGeneralQuestions,
          formObject,
          timestamp
        );
        console.log(
          `GitHub storage result: ${githubStorageSuccess ? 'Success' : 'Failed'}`
        );
      } else {
        console.log('GitHub token not configured, skipping GitHub storage');
      }

      // 2. Discord Webhook
      if (discordWebhookConfigured) {
        console.log('Attempting to send application to Discord webhook...');
        initialBackupSent = await sendToDiscordWebhook(
          roleWithGeneralQuestions,
          formObject,
          timestamp
        );
        console.log(
          `Discord webhook result: ${initialBackupSent ? 'Success' : 'Failed'}`
        );
      } else {
        console.log(
          'Discord webhook not configured, skipping webhook notification'
        );
      }

      // 3. Monday.com
      if (mondayConfigured) {
        console.log('Attempting to store application in Monday.com...');
        const mondayResult = await storeApplicationInMonday(
          roleWithGeneralQuestions,
          formObject,
          timestamp
        );
        console.log(
          `Monday.com integration result: ${mondayResult ? 'Success' : 'Failed'}`
        );
      } else {
        console.log(
          'Monday.com not configured, skipping Monday.com integration'
        );
      }

      // Retry GitHub if it failed
      if (githubTokenConfigured && !githubStorageSuccess) {
        console.log('Retrying GitHub storage...');
        try {
          await storeApplicationDataOnGitHub(
            roleWithGeneralQuestions,
            formObject,
            timestamp
          );
        } catch (retryError) {
          console.error('Retry of GitHub storage also failed:', retryError);
        }
      }

      // Retry Discord if it failed
      if (discordWebhookConfigured && !initialBackupSent) {
        console.log('Retrying Discord webhook backup...');
        try {
          await sendToDiscordWebhook(
            roleWithGeneralQuestions,
            formObject,
            timestamp,
            5 // More retries
          );
        } catch (retryError) {
          console.error('Retry of Discord webhook also failed:', retryError);
        }
      }

      console.log('All integrations completed');
    } catch (error) {
      console.error('Error in application storage process:', error);
    }

    // Return success response after all processing is complete
    console.log(
      'Successfully processed application, returning success response'
    );
    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        timestamp,
      },
      { status: 200 }
    );
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
