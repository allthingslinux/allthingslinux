import Image from 'next/image';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

interface Contributor {
  name: string;
  email: string;
  commits: number;
  avatar: string;
  username: string;
}

async function getFileContributors(filePath: string): Promise<Contributor[]> {
  try {
    // Get the absolute path to the file
    const fullPath = path.resolve(process.cwd(), filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return [];
    }

    console.log(`Getting contributors for file: ${fullPath}`);

    // Get git log for the specific file
    const gitCommand = `git log --pretty=format:"%an|%ae" --follow "${fullPath}" | sort | uniq -c | sort -nr`;
    console.log(`Executing git command: ${gitCommand}`);

    const gitLog = execSync(gitCommand, {
      encoding: 'utf-8',
      cwd: process.cwd(), // Ensure we're in the right directory
    });

    if (!gitLog.trim()) {
      console.log('No git history found for file');
      return [];
    }

    // Parse the git log output
    const contributors = gitLog
      .trim()
      .split('\n')
      .map((line) => {
        const match = line.match(/^\s*(\d+)\s+(.+?)\|(.+)$/);
        if (!match) {
          console.log(`Could not parse line: ${line}`);
          return null;
        }

        const [, commits, name, email] = match;

        // Extract GitHub username from email if possible
        const username = email.includes('@users.noreply.github.com')
          ? email.split('@')[0].replace(/^\d+\+/, '')
          : name.toLowerCase().replace(/\s+/g, '');

        return {
          name,
          email,
          commits: parseInt(commits, 10),
          avatar: `https://github.com/${username}.png`,
          username,
        };
      })
      .filter((c): c is Contributor => c !== null);

    console.log(`Found ${contributors.length} contributors`);
    return contributors;
  } catch (error) {
    console.error('Error getting contributors:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

export async function GitContributors({ filePath }: { filePath: string }) {
  console.log('GitContributors component called with path:', filePath);
  const contributors = await getFileContributors(filePath);

  if (contributors.length === 0) {
    console.log('No contributors found, returning null');
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {contributors.map((contributor) => (
        <a
          key={contributor.email}
          href={`https://github.com/${contributor.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-400 transition-colors"
          title={`${contributor.commits} commits`}
        >
          <Image
            src={contributor.avatar}
            alt={contributor.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span>@{contributor.username}</span>
        </a>
      ))}
    </div>
  );
}
