import type { FormQuestion } from '@/types';

export const systemsQuestions: FormQuestion[] = [
  {
    name: 'interest_and_goals',
    question:
      'What interests you about joining the systems team at All Things Linux, and what professional or technical skills do you hope to learn, practice, or further develop?',
    description:
      'Mention your enthusiasm for technology, open-source contributing, or community-driven projects and any personal growth areas you are looking to explore.',
    type: 'paragraph',
  },
  {
    name: 'personal_qualities',
    question:
      'What personal qualities or strengths do you have that would help you succeed on a systems/development team?',
    description:
      'For example: problem-solving mindset, curiosity, reliability, good communication, patience, or teamwork skills.',
    type: 'paragraph',
  },
  {
    name: 'project_experience',
    question:
      'Have you been involved with any technical or development projects before, either formally or informally? If yes, tell us briefly about your experience. Links are appreciated!',
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'technical_motivation',
    question:
      'What do you find most enjoyable or rewarding when working on technical projects, learning new technologies, or problem-solving?',
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'learning_approach',
    question:
      'How do you typically approach learning something new, troubleshooting unfamiliar issues, or improving your existing technical knowledge?',
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'work_style',
    question:
      'Do you usually prefer working individually, collaboratively with others, or a bit of both when it comes to technical tasks?',
    type: 'short',
  },
  {
    name: 'past_work',
    question:
      "If applicable, feel free to share any examples of past technical work, projects, or contributions you're proud of (like GitHub, GitLab, personal sites, blogs, etc.).",
    type: 'short',
    optional: true,
  },
];
