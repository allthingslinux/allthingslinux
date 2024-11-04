import { z } from 'zod';

// This is a moderator application form

const moderatorApplicationForm = z.object({
  discord_id: z.preprocess((val) => Number(val), z.number()),
  name: z.string().min(1).max(255),
  timezone: z.string().min(1).max(255),
  availability: z.string().min(1).max(255),
  short_introduction: z.string().min(1),
  past_experience: z.string().min(1),
  bot_experience: z.string().min(1),
  notable_skills: z.string().min(1),
  motivations: z.string().min(1),
  fundamentals: z.string().min(1),
  ideas: z.string().min(1),
  additional_info: z.string().min(1).optional(),
});

export type ModeratorApplication = z.infer<typeof moderatorApplicationForm>;

export default moderatorApplicationForm;
