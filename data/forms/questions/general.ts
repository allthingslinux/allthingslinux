import type { FormQuestion } from '@/types';

export const generalQuestions: FormQuestion[] = [
  {
    name: 'discord_username',
    question: 'Discord Username:',
    description: 'Your unique/global username; not a server nickname.',
    type: 'short',
    inputType: 'text',
  },
  {
    name: 'discord_id',
    question: 'Discord ID:',
    type: 'digits-only',
    minLength: 17,
    maxLength: 22,
    description:
      'Learn how to find your Discord ID: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID',
  },
  {
    name: 'preferred_name',
    question: 'Preferred Name:',
    description: 'What would you like us to call you?',
    type: 'short',
  },
  {
    name: 'age',
    question: 'Age:',
    description:
      'We have a minimum age requirement of 16 years old for all roles.',
    type: 'digits-only',
    minLength: 2,
    maxLength: 2,
  },
  {
    name: 'pronouns',
    question: 'Preferred Pronouns:',
    description: 'e.g., he/him, she/her, they/them, etc.',
    type: 'short',
    optional: true,
  },
  {
    name: 'timezone',
    question: 'Timezone:',
    description: 'Please select the closest timezone to your location.',
    type: 'select',
    options: [
      'UTC-12:00 (BIT)', // Baker Island Time
      'UTC-11:00 (NUT)', // Niue Time
      'UTC-10:00 (HAST)', // Hawaii-Aleutian Standard Time
      'UTC-09:00 (AKST)', // Alaska Standard Time
      'UTC-08:00 (PST)', // Pacific Standard Time
      'UTC-07:00 (MST)', // Mountain Standard Time
      'UTC-06:00 (CST)', // Central Standard Time
      'UTC-05:00 (EST)', // Eastern Standard Time
      'UTC-04:00 (AST)', // Atlantic Standard Time
      'UTC-03:00 (ART)', // Argentina Time
      'UTC-02:00 (GST)', // South Georgia Time
      'UTC-01:00 (AZOT)', // Azores Standard Time
      'UTC±00:00 (GMT)', // Greenwich Mean Time
      'UTC+01:00 (CET)', // Central European Time
      'UTC+02:00 (EET)', // Eastern European Time
      'UTC+03:00 (MSK)', // Moscow Standard Time
      'UTC+04:00 (GST)', // Gulf Standard Time
      'UTC+05:00 (PKT)', // Pakistan Standard Time
      'UTC+05:30 (IST)', // Indian Standard Time
      'UTC+06:00 (BST)', // Bangladesh Standard Time
      'UTC+07:00 (ICT)', // Indochina Time
      'UTC+08:00 (CST)', // China Standard Time
      'UTC+09:00 (JST)', // Japan Standard Time
      'UTC+10:00 (AEST)', // Australian Eastern Standard Time
      'UTC+11:00 (SBT)', // Solomon Islands Time
      'UTC+12:00 (FJT)', // Fiji Time
    ],
  },
  {
    name: 'membership_duration',
    question:
      'How long have you been a member of the All Things Linux community?',
    description:
      'There is no minimum requirement, this is just to help us understand your level of engagement with the community.',
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
    showIf: {
      membership_duration: 'Other (please specify):',
    },
  },
  {
    name: 'about_yourself',
    question: 'Tell us a bit about yourself:',
    description:
      "Feel free to briefly introduce yourself, your interests, hobbies, or anything you'd like us to know!",
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'availability',
    question: 'Describe your general availability:',
    description: 'e.g., Weekday evenings, weekends anytime, etc.',
    type: 'short',
  },
  {
    name: 'commitment_hours',
    question:
      'Approximately how many hours per week can you commit to this role?',
    description:
      'Remember, this is a volunteer position, so please be realistic about your availability.',
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
    showIf: {
      commitment_hours: 'Other (Please specify):',
    },
  },
  {
    name: 'motivation',
    question: 'What motivates you to join the All Things Linux team?',
    description:
      'Please share briefly what draws you to our community and mission.',
    type: 'paragraph',
  },
  {
    name: 'relevant_experience',
    question:
      'Do you have any relevant experiences from previous employment, volunteer roles, or personal projects you would like us to know about?',
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
    showIf: {
      code_of_conduct: 'Somewhat (please specify):',
    },
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
    showIf: {
      voice_conversation: 'Other (please explain):',
    },
  },
];
