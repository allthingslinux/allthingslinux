import type { FormQuestion } from '@/types';

export const generalQuestions: FormQuestion[] = [
  {
    name: 'discord_username',
    question: 'Discord Username:',
    type: 'short',
  },
  {
    name: 'discord_id',
    question: 'Discord ID:',
    type: 'short',
  },
  {
    name: 'preferred_name',
    question: 'Preferred Name (What should we call you?):',
    type: 'short',
  },
  {
    name: 'age',
    question:
      "Age: (Optional. Feel free to leave blank if you'd prefer not to answer.)",
    type: 'short',
    optional: true,
  },
  {
    name: 'pronouns',
    question:
      "Preferred Pronouns: (Optional. Feel free to leave blank if you'd prefer not to answer.)",
    type: 'short',
    optional: true,
  },
  {
    name: 'timezone',
    question: 'Timezone:',
    type: 'select',
    options: [
      'UTC-12:00',
      'UTC-11:00',
      'UTC-10:00',
      'UTC-09:00',
      'UTC-08:00 (PST)',
      'UTC-07:00 (MST)',
      'UTC-06:00 (CST)',
      'UTC-05:00 (EST)',
      'UTC-04:00',
      'UTC-03:00',
      'UTC-02:00',
      'UTC-01:00',
      'UTC±00:00',
      'UTC+01:00 (CET)',
      'UTC+02:00 (EET)',
      'UTC+03:00',
      'UTC+04:00',
      'UTC+05:00',
      'UTC+05:30 (IST)',
      'UTC+06:00',
      'UTC+07:00',
      'UTC+08:00',
      'UTC+09:00 (JST)',
      'UTC+10:00',
      'UTC+11:00',
      'UTC+12:00',
    ],
  },
  {
    name: 'about_yourself',
    question: 'Tell us a bit about yourself: (Optional)',
    description:
      "Feel free to briefly introduce yourself, your interests, hobbies, or anything you'd like us to know!",
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'availability',
    question: 'Describe your general availability (Days/Times per week):',
    description:
      'e.g., Weekday evenings, weekends anytime, weekday mornings EST, etc.',
    type: 'short',
  },
  {
    name: 'commitment_hours',
    question:
      'Approximately how many hours per week can you commit to this role?',
    type: 'select',
    options: [
      '1-5 hours',
      '5-10 hours',
      '10-15 hours',
      '15-20 hours',
      '20+ hours',
      'Other (Please specify):',
    ],
  },
  {
    name: 'commitment_hours_other',
    question: 'If you selected "Other" for hours per week, please specify:',
    type: 'short',
    optional: true,
  },
  {
    name: 'membership_duration',
    question:
      'How long have you been a member of the All Things Linux community?',
    type: 'select',
    options: [
      'Less than 1 month',
      '1 - 3 months',
      '3 - 6 months',
      '6 - 12 months',
      'More than 1 year',
      'Other (please specify):',
    ],
  },
  {
    name: 'membership_duration_other',
    question:
      'If you selected "Other" for membership duration, please specify:',
    type: 'short',
    optional: true,
  },
  {
    name: 'motivation',
    question:
      'What motivates you to join the All Things Linux team, and why did you specifically choose this departmental area (Community & Moderation, Systems & Development, Creative & Design)?',
    description:
      "Please share briefly what draws you to our community, our mission, and the specific department you've chosen.",
    type: 'paragraph',
  },
  {
    name: 'skills_experience',
    question:
      'What specific skills, experiences, or personal qualities do you have that make you a great fit for this role or department?',
    description:
      "Describe relevant personal or professional strengths that showcase why you'd excel in your chosen area.",
    type: 'paragraph',
  },
  {
    name: 'goals',
    question:
      'What personal or professional goals do you hope to achieve or skills do you hope to develop through contributing to our team?',
    description: 'Help us understand how this aligns with your aspirations.',
    type: 'paragraph',
  },
  {
    name: 'relevant_experience',
    question:
      'Do you have any relevant experiences from previous employment, volunteer roles, or personal projects you would like us to know about? (Optional)',
    description: 'Links to past projects or references welcome!',
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'code_of_conduct',
    question:
      'Have you read, understood, and agree to abide by our Code of Conduct and Community Guidelines?',
    description: 'Please review before answering.',
    type: 'select',
    options: ['Yes, fully', 'No', 'Somewhat (please specify):'],
  },
  {
    name: 'code_of_conduct_comment',
    question:
      'If you selected "Somewhat" regarding the Code of Conduct, please explain:',
    type: 'short',
    optional: true,
  },
  {
    name: 'voice_conversation',
    question:
      'If we move forward with your application, would you be open to attending a brief, casual voice conversation as the next step?',
    description:
      'This is intended as an informal chat, not a formal interview.',
    type: 'select',
    options: ['Yes', 'No', 'Other (please explain):'],
  },
  {
    name: 'voice_conversation_comment',
    question:
      'If you selected "Other" regarding voice conversation, please explain:',
    type: 'short',
    optional: true,
  },
];
