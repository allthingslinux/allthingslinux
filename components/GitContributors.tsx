import Image from 'next/image';
import { execSync } from 'child_process';
import path from 'path';

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

    // Get git log for the specific file
    const gitLog = execSync(
      `git log --pretty=format:"%an|%ae" --follow "${fullPath}" | sort | uniq -c | sort -nr`,
      { encoding: 'utf-8' }
    );

    // Parse the git log output
    const contributors = gitLog
      .trim()
      .split('\n')
      .map((line) => {
        const match = line.match(/^\s*(\d+)\s+(.+?)\|(.+)$/);
        if (!match) return null;

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

    return contributors;
  } catch (error) {
    console.error('Error getting contributors:', error);
    return [];
  }
}

export async function GitContributors({ filePath }: { filePath: string }) {
  const contributors = await getFileContributors(filePath);

  if (contributors.length === 0) {
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
