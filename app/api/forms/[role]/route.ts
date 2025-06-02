import { NextRequest, NextResponse } from 'next/server';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import type { FormData, Role, SubmissionPayload } from '@/lib/types';
import { submitApplicationTask } from '@/trigger/jobs/submitApplication';
import { ZodError } from 'zod';

// Add dynamic and cache controls for better Cloudflare compatibility
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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

    // Construct payload for the event
    const submissionPayload: SubmissionPayload = {
      roleData: roleWithGeneralQuestions,
      formData: formObject,
      timestamp: timestamp,
    };

    console.log('Triggering Trigger.dev task with payload:', submissionPayload);

    // Trigger the task directly
    // Suppress TS error - linter incorrectly matches trigger param with run param shape
    // @ts-expect-error - Argument type mismatch is likely a tooling/type definition issue
    const handle = await submitApplicationTask.trigger(submissionPayload);

    console.log('Trigger.dev task triggered successfully:', handle.id);

    return NextResponse.json(
      {
        message: `Application submission for ${roleSlug} received and background task triggered. Task ID: ${handle.id}`,
        taskId: handle.id,
      },
      { status: 202 } // 202 Accepted as processing is deferred
    );
  } catch (error: unknown) {
    console.error(
      'Error processing form submission or triggering task:',
      error
    );
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Submission validation failed', error: error.issues },
        { status: 400 }
      );
    }
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: 'Error processing submission', error: errorMessage },
      { status: 500 }
    );
  }
}
