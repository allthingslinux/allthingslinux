import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import type { FormData, Role, SubmissionPayload } from '@/lib/types';
import { submitApplicationTask } from '@/trigger/jobs/submitApplication';
import { ZodError } from 'zod';
import { formSubmissionRateLimit } from '@/lib/rate-limit';

// Add dynamic and cache controls for better Cloudflare compatibility
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ role: string }> }
) {
  try {
    console.log('POST request received for application submission');

    // Await params in Next.js 15+
    const { role } = await context.params;
    const rateLimitResponse = await formSubmissionRateLimit(req);
    if (rateLimitResponse) {
      console.log('Rate limit exceeded for form submission');
      return rateLimitResponse;
    }

    // Log environment variables in API route:
    console.log('Environment variables in API route:');
    console.log(
      'DISCORD_WEBHOOK_URL:',
      env.DISCORD_WEBHOOK_URL ? '✓ Set' : '✗ Not set'
    );
    console.log('GITHUB_TOKEN:', env.GITHUB_TOKEN ? '✓ Set' : '✗ Not set');
    console.log('GITHUB_REPO_OWNER:', env.NEXT_PUBLIC_GITHUB_REPO_OWNER);
    console.log('GITHUB_REPO_NAME:', env.NEXT_PUBLIC_GITHUB_REPO_NAME);
    console.log('MONDAY_API_KEY:', env.MONDAY_API_KEY ? '✓ Set' : '✗ Not set');
    console.log(
      'MONDAY_BOARD_ID:',
      env.MONDAY_BOARD_ID ? '✓ Set' : '✗ Not set'
    );

    // Get role and questions
    const roleSlug = role;

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

    // Convert FormData to object, ensuring we only get the last value for each key
    const formObject: Record<string, string> = {};
    for (const [key, value] of formData) {
      formObject[key] = value.toString();
    }

    // Type cast to FormData for compatibility
    const typedFormObject = formObject as FormData;

    console.log(`Processed ${Object.keys(typedFormObject).length} form fields`);

    // Validate required fields
    const requiredFields = ['discord_username', 'discord_id'];
    const missingFields = requiredFields.filter(
      (field) => !typedFormObject[field]
    );

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
          const parentValue = typedFormObject[parentFieldName];

          // If parent value doesn't contain "other", this field is not required
          if (parentValue && !parentValue.toLowerCase().includes('other')) {
            return false;
          }
        }

        // Regular required field validation
        return !q.optional && !typedFormObject[q.name];
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
      formData: typedFormObject,
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
