import type { Role, FormData, Question } from '../types';

// Create a function for base64 encoding that is Cloudflare-compatible
function base64Encode(str: string): string {
  // Use Cloudflare-compatible approach
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  return btoa(
    Array.from(data)
      .map((byte) => String.fromCharCode(byte))
      .join('')
  );
}

/**
 * Stores application data in GitHub repository
 */
export async function storeApplicationDataOnGitHub(
  roleData: Role,
  formData: FormData,
  timestamp: string
) {
  try {
    // Direct access to process.env
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.log('GitHub token not configured, skipping GitHub storage');
      return false;
    }

    console.log('Attempting to store application data on GitHub...');

    const repoOwner =
      process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER || 'allthingslinux';
    const repoName = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME || 'applications';

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
      generalAnswers: roleData.generalQuestions
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

    // Use the separate function for encoding
    const contentEncoded = base64Encode(content);

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
