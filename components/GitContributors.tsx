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
  lastCommitDate: string;
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

    // Get git log with author info and count commits
    const gitCommand = `git log --format="%an|%ae|%at" --follow "${fullPath}"`;
    console.log(`Executing git command: ${gitCommand}`);

    const gitLog = execSync(gitCommand, {
      encoding: 'utf-8',
      cwd: process.cwd(),
    });

    if (!gitLog.trim()) {
      console.log('No git history found for file');
      return [];
    }

    // Parse the git log output and track contributors
    const contributorMap = new Map<string, Contributor>();

    gitLog
      .trim()
      .split('\n')
      .forEach((line) => {
        const [name, email, timestamp] = line.split('|');

        // Process author
        const username = email.includes('@users.noreply.github.com')
          ? email.split('@')[0].replace(/^\d+\+/, '')
          : name.toLowerCase().replace(/\s+/g, '');

        if (!contributorMap.has(email)) {
          contributorMap.set(email, {
            name,
            email,
            commits: 1,
            avatar: `https://github.com/${username}.png`,
            username,
            lastCommitDate: new Date(parseInt(timestamp) * 1000).toISOString(),
          });
        } else {
          const contributor = contributorMap.get(email)!;
          contributor.commits++;
          // Update lastCommitDate if this commit is more recent
          const commitDate = new Date(parseInt(timestamp) * 1000);
          const currentLastDate = new Date(contributor.lastCommitDate);
          if (commitDate > currentLastDate) {
            contributor.lastCommitDate = commitDate.toISOString();
          }
        }
      });

    // Convert map to array and sort by commits
    const contributors = Array.from(contributorMap.values()).sort(
      (a, b) => b.commits - a.commits
    );

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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {contributors.map((contributor) => (
          <a
            key={contributor.email}
            href={`https://github.com/${contributor.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-400 transition-colors"
            title={`${contributor.commits} commit${contributor.commits > 1 ? 's' : ''}\nLast contribution: ${new Date(contributor.lastCommitDate).toLocaleDateString()}`}
          >
            <Image
              src={contributor.avatar}
              alt={contributor.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>@{contributor.username}</span>
            <span className="text-xs text-muted-foreground">
              ({contributor.commits})
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
