import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DISCORD_WEBHOOK_URL: z.string().url().optional(),
    GITHUB_TOKEN: z.string().optional(),
    GITHUB_REPO_OWNER: z.string().default('allthingslinux'),
    GITHUB_REPO_NAME: z.string().default('applications'),
    MONDAY_API_KEY: z.string().optional(),
    MONDAY_BOARD_ID: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().url().default('https://allthingslinux.org'),
  },
  // This destructures the environment variables for use in edge functions
  runtimeEnv: {
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER,
    GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
    MONDAY_API_KEY: process.env.MONDAY_API_KEY,
    MONDAY_BOARD_ID: process.env.MONDAY_BOARD_ID,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
  emptyStringAsUndefined: true,
});
