// app/jobs/submitApplication.ts
// Using Trigger.dev SDK v4 pattern
import { task, logger } from '@trigger.dev/sdk';
import { storeApplicationDataOnGitHub } from '../../lib/integrations/github';
import { sendToDiscordWebhook } from '../../lib/integrations/discord';
import { storeApplicationInMonday } from '../../lib/integrations/monday-graphql';
import { z } from 'zod';
import { env } from '@/env'; // Import the validated env object

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
      // Logger might not be available yet if validation fails early
      console.error('Invalid payload received', {
        error: validation.error.issues,
      });
      throw new Error('Task received an invalid payload.');
    }
    const { roleData, formData, timestamp } = validation.data;

    // env object is validated on import, no need for manual check here.
    // If required variables were missing, the process would have already thrown an error.
    await logger.info(
      `🚀 [Job Start] submit-application in ${env.NODE_ENV} environment`
    );

    // GitHub Integration
    await logger.info('Running GitHub Integration...');
    try {
      // Use the type-safe env object with non-null assertion
      const githubSuccess = await storeApplicationDataOnGitHub(
        roleData,
        formData,
        timestamp,
        env.GITHUB_TOKEN!,
        env.NEXT_PUBLIC_GITHUB_REPO_OWNER!,
        env.NEXT_PUBLIC_GITHUB_REPO_NAME!
      );
      if (!githubSuccess) throw new Error('GitHub Integration Failed');
      await logger.info('GitHub Integration Succeeded');
    } catch (error) {
      await logger.error('GitHub Integration Failed', { error });
      // Re-throw to ensure the job fails if this step fails
      throw error;
    }

    // Discord Integration
    await logger.info('Running Discord Integration...');
    try {
      // Use the type-safe env object with non-null assertion
      const discordSuccess = await sendToDiscordWebhook(
        roleData,
        formData,
        timestamp,
        env.DISCORD_WEBHOOK_URL!
      );
      if (!discordSuccess) throw new Error('Discord Integration Failed');
      await logger.info('Discord Integration Succeeded (or finished attempts)');
    } catch (error) {
      await logger.error('Discord Integration Failed', { error });
      // Re-throw to ensure the job fails if this step fails
      throw error;
    }

    // Monday Integration
    await logger.info('Running Monday Integration...');
    try {
      // Use the type-safe env object with non-null assertion
      const mondaySuccess = await storeApplicationInMonday(
        roleData,
        formData,
        timestamp,
        env.MONDAY_API_KEY!,
        env.MONDAY_BOARD_ID!
      );
      if (!mondaySuccess) throw new Error('Monday Integration Failed');
      await logger.info('Monday Integration Succeeded');
    } catch (error) {
      await logger.error('Monday Integration Failed', { error });
      // Re-throw to ensure the job fails if this step fails
      throw error;
    }

    await logger.info('✅ [Job Success] submit-application');
  },
});
