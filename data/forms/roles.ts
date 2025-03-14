import type { Role } from '@/types';

// general questions come first and are global across all roles (always required)
// departmental questions come next and are specific to the department (typically required)
// role-specific questions come last and are specific to the role (optional)

// Departmental questions
import { moderationQuestions } from './questions/departmental/moderation';

// Role-specific questions
import { moderatorQuestions } from './questions/roles/moderation/moderator';

// All roles defined clearly in one single data source
export const roles: Role[] = [
  {
    slug: 'moderator',
    name: 'Moderator',
    department: 'Community & Moderation',
    description:
      'Help enforce our Code of Conduct & guidelines, ensuring a safe and welcoming environment.',
    // Only department and role specific
    questions: [...moderationQuestions, ...moderatorQuestions],
  },
];
