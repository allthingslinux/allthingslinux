import type { FormQuestion } from '@/types';

export const moderationQuestions: FormQuestion[] = [
  {
    name: 'moderation_interest',
    question:
      'What interests you about becoming a moderator for the All Things Linux community?',
    type: 'paragraph',
    description:
      'Mention why moderation or supporting a welcoming community appeals to you.',
    rows: 6,
  },
  {
    name: 'important_responsibility',
    question:
      'In your opinion, what is the most important responsibility of a moderator?',
    type: 'paragraph',
    description:
      'For example: ensuring safety, helping others, conflict resolution, fostering friendly interactions, etc.',
    rows: 4,
  },
  {
    name: 'personal_qualities',
    question:
      'What personal qualities or strengths do you feel you have that would help you be successful as a moderator?',
    type: 'paragraph',
    description:
      'For example: patience, empathy, being attentive, fairness, reliability, good communication.',
    rows: 6,
  },
  {
    name: 'previous_experience',
    question:
      'Have you had any previous experience with moderation or community support roles (formal or informal)?',
    type: 'paragraph',
    description:
      'Can include Discord servers, online communities, gaming clans, school clubs—any relevant informal experience counts.',
    optional: true,
    rows: 6,
  },
  {
    name: 'moderation_tools',
    question:
      "Have you used any moderation tools or bots before? Are there particular moderation tools you're interested in learning about?",
    type: 'paragraph',
    description:
      "Examples: Wick, Dyno, Helper.gg, or any other moderation tools you've used or want to learn.",
    optional: true,
    rows: 4,
  },
  {
    name: 'communication_style',
    question:
      'How would you describe your communication style when interacting with community members?',
    type: 'select',
    description:
      'Choose the style that best matches your approach to community interaction.',
    options: [
      'Friendly & Casual',
      'Professional & Formal',
      'Firm but Friendly',
      'Adaptable (varies by situation)',
      'Direct & Straightforward',
    ],
  },
  {
    name: 'team_collaboration',
    question:
      'Are you comfortable working closely with others as part of a moderator team?',
    type: 'select',
    description:
      'This includes sharing ideas, asking questions, and collaborating regularly.',
    options: [
      'Yes, very comfortable',
      'Yes, somewhat comfortable',
      'Neutral',
      'No, prefer working independently',
    ],
  },
  {
    name: 'uncertainty_approach',
    question:
      "If you're unsure about a moderation decision or action, how do you typically approach resolving that uncertainty?",
    type: 'paragraph',
    description:
      'For example: discuss with others, check guidelines, ask for guidance from senior staff or mentors.',
    rows: 4,
  },
  {
    name: 'growth_goals',
    question:
      'What skills, qualities, or knowledge are you hoping to learn or develop through moderating with us?',
    type: 'paragraph',
    description: 'Provide brief insight into your personal growth goals.',
    optional: true,
    rows: 4,
  },
];
