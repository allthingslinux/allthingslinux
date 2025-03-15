import { NextResponse } from 'next/server';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import crypto from 'crypto';

interface FormRole {
  slug: string;
  name: string;
  department: string;
  questions: any[];
}

interface Question {
  id: string;
  label?: string;
}

// In-memory storage for temporary files
const temporaryFiles: Record<
  string,
  {
    content: string;
    fileName: string;
    created: Date;
  }
> = {};

// Cleanup function for old files (runs every hour)
setInterval(
  () => {
    const now = new Date();
    Object.keys(temporaryFiles).forEach((key) => {
      const fileAge = now.getTime() - temporaryFiles[key].created.getTime();
      if (fileAge > 24 * 60 * 60 * 1000) {
        // 24 hours
        delete temporaryFiles[key];
      }
    });
  },
  60 * 60 * 1000
);

// Server-side API route for form submissions
export async function POST(
  request: Request,
  context: { params: { slug: string } }
) {
  try {
    // Fix: Access the slug directly from context.params without destructuring
    const slug = context.params.slug;
    const role = roles.find((r) => r.slug === slug) as FormRole;

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Parse and sanitize request data
    let formData;
    try {
      formData = await request.json();
    } catch (jsonError) {
      console.error('Error parsing request body:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const sanitizedData = { ...formData };
    delete sanitizedData.ssn; // Remove sensitive fields

    // Generate markdown document from form data
    const allQuestions = [...generalQuestions, ...role.questions];
    const markdownDocument = generateMarkdownFromForm(
      sanitizedData,
      allQuestions,
      role
    );

    // Generate a unique file ID and URL
    const fileId = crypto.randomBytes(16).toString('hex');
    const fileName = `${role.slug}-application-${Date.now()}.md`;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get('origin') ||
      'http://localhost:3000';
    const fileUrl = `${baseUrl}/api/files/${fileId}`;

    // Store the file content in memory
    temporaryFiles[fileId] = {
      content: markdownDocument,
      fileName: fileName,
      created: new Date(),
    };

    // Send to webhook if configured
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        // Create base64 version for file handling
        const base64Markdown = Buffer.from(markdownDocument).toString('base64');

        // Prepare webhook payload
        const webhookPayload = {
          // Application metadata
          application_type: role.name,
          role_slug: role.slug,
          department: role.department,
          submitted_at: new Date().toISOString(),

          // Applicant information
          name:
            sanitizedData.preferred_name ||
            sanitizedData.name ||
            'Not provided',
          discord: sanitizedData.discord_username || 'Not provided',
          email: sanitizedData.email || 'Not provided',

          // Content and file handling
          markdown_content: markdownDocument,
          plain_content: markdownDocument
            .replace(/##|###|#/g, '')
            .replace(/\n\n/g, '\n'),
          file_name: fileName,
          file_base64: base64Markdown,
          file_type: 'text/markdown',

          // URL for accessing the file
          file_url: fileUrl,

          // Testing
          test_field: 'MAKE_CONNECTION_TEST',
        };

        // Send to webhook
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });

        // Handle webhook response
        if (!webhookResponse.ok) {
          console.error('Webhook failed:', await webhookResponse.text());
          return NextResponse.json(
            { error: 'Failed to deliver to external system' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Application submitted successfully',
          fileUrl: fileUrl,
        });
      } catch (webhookError) {
        console.error('Error sending to webhook:', webhookError);
        return NextResponse.json(
          { error: 'Failed to deliver application' },
          { status: 500 }
        );
      }
    } else {
      console.warn('No webhook URL configured');
      return NextResponse.json(
        { error: 'Application submission service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

// Generate markdown from form data
function generateMarkdownFromForm(
  formData: any,
  questions: Question[],
  role: FormRole
): string {
  let markdown = `# ${role.name} Application\n\n`;
  markdown += `Department: ${role.department}\n`;
  markdown += `Submitted: ${new Date().toLocaleString()}\n\n`;
  markdown += `## Applicant Information\n\n`;

  // Map question IDs to their labels
  const questionMap: Record<string, string> = {};
  questions.forEach((question) => {
    if (question?.id) {
      questionMap[question.id] =
        question.label || humanizeFieldName(question.id);
    }
  });

  // Order keys by question order when possible
  const orderedKeys: string[] = [];
  questions.forEach((question) => {
    if (question?.id && formData.hasOwnProperty(question.id)) {
      orderedKeys.push(question.id);
    }
  });

  // Add any remaining form data keys
  Object.keys(formData).forEach((key) => {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });

  // Generate markdown for each form field
  orderedKeys.forEach((key) => {
    const value = formData[key];
    const label = questionMap[key] || humanizeFieldName(key);

    markdown += `### ${label}\n\n`;

    if (Array.isArray(value)) {
      markdown += value.join(', ') + '\n\n';
    } else if (typeof value === 'boolean') {
      markdown += (value ? 'Yes' : 'No') + '\n\n';
    } else if (value === null || value === undefined) {
      markdown += 'Not provided\n\n';
    } else {
      markdown += `${value}\n\n`;
    }
  });

  return markdown;
}

// Convert field names to human-readable format
function humanizeFieldName(fieldName: string): string {
  return fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// GET endpoint for accessing the files
export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  // Fix: Access the slug directly from context.params without destructuring
  const fileId = context.params.slug;

  if (!temporaryFiles[fileId]) {
    return NextResponse.json(
      { error: 'File not found or expired' },
      { status: 404 }
    );
  }

  const file = temporaryFiles[fileId];
  return new Response(file.content, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    },
  });
}
