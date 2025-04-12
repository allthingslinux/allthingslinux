// app/jobs/submitApplication.ts
// Using Trigger.dev SDK v4 pattern
import { task, logger } from '@trigger.dev/sdk';
import { storeApplicationDataOnGitHub } from '../../lib/integrations/github';
import { sendToDiscordWebhook } from '../../lib/integrations/discord';
import { storeApplicationInMonday } from '../../lib/integrations/monday-graphql';
import { z } from 'zod';

// Define the Zod schema - used for payload validation inside the task
const submissionPayloadSchema = z.object({
  roleData: z.any().describe('Role data object including general questions'),
  formData: z.any().describe('Parsed form data object'),
  timestamp: z.string().describe('ISO timestamp string of submission'),
});

// Define and EXPORT the task using the 'task' function from v4 SDK
export const submitApplicationTask = task({
  id: 'submit-application',
  run: async (payload) => {
    const validation = submissionPayloadSchema.safeParse(payload);
    if (!validation.success) {
      if (logger.error) {
        await logger.error('Invalid payload received', {
          error: validation.error.issues,
        });
      } else {
        console.error('Invalid payload received & logger unavailable', {
          error: validation.error.issues,
        });
      }
      throw new Error('Task received an invalid payload.');
    }
    const { roleData, formData, timestamp } = validation.data;

    await logger.info('🚀 [Job Start] submit-application');

    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER;
    const repoName = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const mondayApiKey = process.env.MONDAY_API_KEY;
    const mondayBoardId = process.env.MONDAY_BOARD_ID;

    if (
      !githubToken ||
      !repoOwner ||
      !repoName ||
      !discordWebhookUrl ||
      !mondayApiKey ||
      !mondayBoardId
    ) {
      await logger.error(
        'Missing essential environment variables/secrets. Job cannot run.'
      );
      throw new Error('Missing essential environment variables/secrets.');
    }

    // GitHub Integration
    await logger.info('Running GitHub Integration...');
    try {
      const githubSuccess = await storeApplicationDataOnGitHub(
        roleData,
        formData,
        timestamp,
        githubToken,
        repoOwner,
        repoName
      );
      if (!githubSuccess) throw new Error('GitHub Integration Failed');
      await logger.info('GitHub Integration Succeeded');
    } catch (error) {
      await logger.error('GitHub Integration Failed', { error });
      throw error;
    }

    // Discord Integration
    await logger.info('Running Discord Integration...');
    try {
      const discordSuccess = await sendToDiscordWebhook(
        roleData,
        formData,
        timestamp,
        discordWebhookUrl
      );
      if (!discordSuccess) throw new Error('Discord Integration Failed');
      await logger.info('Discord Integration Succeeded (or finished attempts)');
    } catch (error) {
      await logger.error('Discord Integration Failed', { error });
      throw error;
    }

    // Monday Integration
    await logger.info('Running Monday Integration...');
    try {
      const mondaySuccess = await storeApplicationInMonday(
        roleData,
        formData,
        timestamp,
        mondayApiKey,
        mondayBoardId
      );
      if (!mondaySuccess) throw new Error('Monday Integration Failed');
      await logger.info('Monday Integration Succeeded');
    } catch (error) {
      await logger.error('Monday Integration Failed', { error });
      throw error;
    }

    await logger.info('✅ [Job Success] submit-application');
  },
});
