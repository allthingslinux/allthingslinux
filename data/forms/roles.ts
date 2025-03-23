import type { Role } from '@/types';

import { moderationQuestions } from './questions/departmental/moderation';
import { managementQuestions } from './questions/departmental/management';
import { creativeQuestions } from './questions/departmental/creative';
import { systemsQuestions } from './questions/departmental/systems';

import { moderatorQuestions } from './questions/roles/moderation/moderator';

export const moderationRoles: Role[] = [
  {
    slug: 'senior-moderator',
    name: 'Senior Moderator',
    department: 'Moderation',
    description:
      'Senior Moderators are responsible for overseeing Moderator actions, resolving complex disputes, and keeping the Moderator team running smoothly with wisdom and support.',
    questions: [...moderationQuestions],
  },
  {
    slug: 'moderator',
    name: 'Moderator',
    department: 'Moderation',
    description:
      'Moderators are responsible for enforcing our Code of Conduct and keeping the community safe and welcoming. They are the first line of defense and backbone of the community.',
    questions: [...moderationQuestions, ...moderatorQuestions],
  },
];

export const managementRoles: Role[] = [
  {
    slug: 'administrator',
    name: 'Administrator',
    department: 'Management',
    description:
      'Administrators are responsible for the overall management of the community. They set the vision and direction for the community, make key decisions, and act as a liaison between community and staff.',
    questions: [...managementQuestions],
  },
  {
    slug: 'assistant-administrator',
    name: 'Assistant Administrator',
    department: 'Management',
    description:
      'The Assistant Administrator is responsible for supporting Administrators in the day-to-day running of the community. They help with note taking, task management, and other administrative duties.',
    questions: [...managementQuestions],
  },
  {
    slug: 'director-of-moderation',
    name: 'Director of Moderation',
    department: 'Management',
    description:
      'The Director of Moderation is responsible for overseeing the entire moderation team. They establish tone and culture for the team, develop policies and procedures, and onboard new moderators.',
    questions: [...managementQuestions],
  },
];

export const creativeRoles: Role[] = [
  {
    slug: 'creative-director',
    name: 'Creative Director',
    department: 'Creative',
    description:
      'The Creative Director is responsible for developing and establishing our creative vision. They oversee all design, branding and marketing efforts, and ensure that we maintain a consistent visual identity.',
    questions: [...creativeQuestions],
  },
  {
    slug: 'graphic-designer',
    name: 'Graphic Designer',
    department: 'Creative',
    description:
      'Graphic Designers are responsible for creating visual content for our community. They work closely with the Creative Director to ensure that all design work is consistent with our brand and style guide.',
    questions: [...creativeQuestions],
  },
  {
    slug: 'pixel-artist',
    name: 'Pixel Artist',
    department: 'Creative',
    description:
      'Pixel Artists are graphic designers who specialize in creating pixel/bitmap art. They are responsible for creating all pixel art used in our various projects and assets as needed.',
    questions: [...creativeQuestions],
  },
];

export const systemsRoles: Role[] = [
  {
    // Technical role for managing our servers and infrastructure
    slug: 'systems-administrator',
    name: 'Systems Administrator',
    department: 'Systems',
    description:
      'Systems Administrators are responsible for the overall management of our servers and infrastructure. They ensure that our systems are running smoothly and efficiently.',
    questions: [...systemsQuestions],
  },
];

export const roles: Role[] = [
  ...moderationRoles,
  ...managementRoles,
  ...creativeRoles,
  ...systemsRoles,
];
