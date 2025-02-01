import React from 'react';
import { cn } from '@/lib/utils';
import {
  GitPullRequest,
  GitCommit,
  GitFork,
  CircleDot,
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
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-blue-300 text-xs sm:text-sm">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300 text-xs sm:text-sm">{repoName}</span>
            <span className="text-muted-foreground">#</span>
            <span className="text-blue-400 font-mono text-xs sm:text-sm">
              {reference.replace('#', '')}
            </span>
          </span>
        );
      } else {
        displayText = (
          <span className="text-blue-400 font-mono text-xs sm:text-sm">
            {reference}
          </span>
        );
      }
      break;
    case 'pr':
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/pull/${reference.replace('#', '')}`;
      icon = <GitPullRequest className="h-4 w-4 text-blue-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-blue-300 text-xs sm:text-sm">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300 text-xs sm:text-sm">{repoName}</span>
            <span className="text-muted-foreground">#</span>
            <span className="text-blue-400 font-mono text-xs sm:text-sm">
              {reference.replace('#', '')}
            </span>
          </span>
        );
      } else {
        displayText = (
          <span className="text-blue-400 font-mono text-xs sm:text-sm">
            {reference}
          </span>
        );
      }
      break;
    case 'branch':
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/tree/${reference}`;
      icon = <GitBranch className="h-4 w-4 text-purple-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex flex-wrap items-center gap-1.5">
            {repo !== 'allthingslinux/allthingslinux' ? (
              <>
                <span className="text-blue-300 text-xs sm:text-sm">{org}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-blue-300 text-xs sm:text-sm">
                  {repoName}
                </span>
                <span className="text-muted-foreground">:</span>
              </>
            ) : (
              <span className="hidden sm:inline-flex sm:items-center">
                <span className="text-blue-300 text-sm">{org}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-blue-300 text-sm">{repoName}</span>
                <span className="text-muted-foreground">:</span>
              </span>
            )}
            <span className="text-purple-400 text-xs sm:text-sm">
              {reference}
            </span>
          </span>
        );
      } else {
        displayText = (
          <span className="text-purple-400 text-xs sm:text-sm">
            {reference}
          </span>
        );
      }
      break;
    case 'commit':
      shortReference = reference.slice(0, 7);
      href = `https://github.com/${repo || 'allthingslinux/allthingslinux'}/commit/${reference}`;
      icon = <GitCommit className="h-4 w-4 text-green-400" />;
      if (repo) {
        const [org, repoName] = repo.split('/');
        displayText = (
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-blue-300 text-xs sm:text-sm">{org}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-blue-300 text-xs sm:text-sm">{repoName}</span>
            <span className="text-muted-foreground">@</span>
            <span className="text-green-400 text-xs sm:text-sm">
              {shortReference}
            </span>
          </span>
        );
      } else {
        displayText = (
          <span className="text-green-400 text-xs sm:text-sm">
            {shortReference}
          </span>
        );
      }
      break;
    case 'user':
    case 'org':
      href = `https://github.com/${username}`;
      avatar = (
        <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
          <AvatarImage
            src={`https://github.com/${username}.png`}
            alt={username}
          />
        </Avatar>
      );
      displayText = <span className="text-xs sm:text-sm">@{username}</span>;
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
        'inline-flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-medium',
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
          <span className="text-blue-300 text-xs sm:text-sm">{label}</span>
        )}
      </span>
      {typeof displayText === 'string' ? (
        <span
          className={cn(
            'text-blue-400 text-xs sm:text-sm',
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
