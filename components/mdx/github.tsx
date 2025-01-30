import React from 'react';
import { cn } from '@/lib/utils';
import {
  GitPullRequest,
  GitCommit,
  User,
  GitFork,
  CircleDot,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface GitHubLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  type: 'issue' | 'pr' | 'commit' | 'user' | 'repo' | 'org' | 'branch';
  reference: string;
  repo?: string;
  className?: string;
}

export function GitHubLink({
  type,
  reference,
  repo,
  className,
  ...props
}: GitHubLinkProps) {
  let href = '';
  let icon = null;
  let label = '';
  let displayText: string | React.ReactNode = reference;
  let avatar = null;
  let shortReference = '';

  const username = reference.replace('@', '');

  switch (type) {
    case 'issue':
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/issues/${reference.replace('#', '')}`;
      icon = <CircleDot className="h-4 w-4 text-blue-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex items-center gap-1.5">
            <span className="text-blue-300">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300">{repoName}</span>
            <span className="text-muted-foreground">#</span>
            <span className="text-blue-400 font-mono">
              {reference.replace('#', '')}
            </span>
          </span>
        );
      } else {
        displayText = (
          <span className="text-blue-400 font-mono">{reference}</span>
        );
      }
      break;
    case 'pr':
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/pull/${reference.replace('#', '')}`;
      icon = <GitPullRequest className="h-4 w-4 text-blue-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex items-center gap-1.5">
            <span className="text-blue-300">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300">{repoName}</span>
            <span className="text-muted-foreground">#</span>
            <span className="text-blue-400 font-mono">
              {reference.replace('#', '')}
            </span>
          </span>
        );
      } else {
        displayText = (
          <span className="text-blue-400 font-mono">{reference}</span>
        );
      }
      break;
    case 'branch':
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/tree/${reference}`;
      icon = <GitBranch className="h-4 w-4 text-purple-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex items-center gap-1.5">
            <span className="text-blue-300">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300">{repoName}</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-purple-400">{reference}</span>
          </span>
        );
      } else {
        displayText = <span className="text-purple-400">{reference}</span>;
      }
      break;
    case 'commit':
      shortReference = reference.slice(0, 7);
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/commit/${reference}`;
      icon = <GitCommit className="h-4 w-4 text-green-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex items-center gap-1.5">
            <span className="text-blue-300">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300">{repoName}</span>
            <span className="text-muted-foreground">@</span>
            <span className="text-green-400">{shortReference}</span>
          </span>
        );
      } else {
        displayText = <span className="text-green-400">{shortReference}</span>;
      }
      break;
    case 'user':
    case 'org':
      href = `https://github.com/${username}`;
      avatar = (
        <Avatar className="h-5 w-5">
          <AvatarImage
            src={`https://github.com/${username}.png`}
            alt={username}
          />
        </Avatar>
      );
      displayText = `@${username}`;
      break;
    case 'repo':
      href = `https://github.com/${reference}`;
      icon = <GitFork className="h-4 w-4" />;
      label = 'Repository';
      break;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium',
        type === 'commit' && 'font-mono bg-green-500/10 hover:bg-green-500/20',
        type === 'branch' &&
          'font-mono bg-purple-500/10 hover:bg-purple-500/20',
        ['issue', 'pr'].includes(type) &&
          'font-mono bg-blue-500/10 hover:bg-blue-500/20',
        !['issue', 'pr', 'commit', 'branch'].includes(type) &&
          'bg-blue-500/10 hover:bg-blue-500/20',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1">
        {avatar || icon}
        {!['user', 'org', 'commit', 'branch', 'issue', 'pr'].includes(type) && (
          <span className="text-blue-300">{label}</span>
        )}
      </span>
      {typeof displayText === 'string' ? (
        <span
          className={cn(
            'text-blue-400',
            type === 'commit' && 'text-green-400',
            type === 'branch' && 'text-purple-400'
          )}
        >
          {displayText}
        </span>
      ) : (
        displayText
      )}
    </a>
  );
}
