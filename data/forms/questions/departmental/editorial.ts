import type { FormQuestion } from '@/types';

export const editorialQuestions: FormQuestion[] = [
  {
    name: 'editorial_voice_and_style',
    question:
      'How would you describe your approach to editorial voice and style, especially when writing for a collective or community?',
    description:
      'You can reflect on how you shape tone, adapt to different contexts, or maintain consistency across diverse content types.',
    type: 'paragraph',
  },
  {
    name: 'writing_for_atl',
    question:
      'Why do you want to contribute your writing and editorial skills specifically to All Things Linux?',
    description:
      'Feel free to mention your connection to open-source culture, passion for Linux, or interest in shaping community messaging.',
    type: 'paragraph',
  },
  {
    name: 'content_skills_and_strengths',
    question:
      'What personal strengths or skills make you a strong fit for a role focused on writing, editing, and content strategy?',
    description:
      'Consider traits like clarity of thought, empathy, adaptability, systems thinking, or ability to distill complex ideas.',
    type: 'paragraph',
  },
  {
    name: 'writing_and_editing_experience',
    question:
      'Do you have any previous experience writing, editing, or developing content for projects, communities, or organizations?',
    description:
      'This can include documentation, blogs, brand copy, academic writing, or anything relevant to content work.',
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'tools_for_content_work',
    question:
      'What writing, editing, or content-related tools do you use or want to learn (e.g. Markdown, Notion, Obsidian, Hemingway, Grammarly, Figma)?',
    description:
      'Include software, workflows, or systems you find useful for creating and organizing content.',
    type: 'paragraph',
  },
  {
    name: 'content_learning_interest',
    question:
      'Are there any specific areas of writing, editing, or content strategy you’d like to grow in during your time with ATL?',
    type: 'paragraph',
    optional: true,
  },
  {
    name: 'writing_samples_links',
    question:
      'If you have writing samples, websites, or any related work to share, please drop the links here:',
    type: 'short',
    optional: true,
  },
  {
    name: 'collaboration_style_content',
    question:
      'How do you approach collaboration and communication when working on content with a team?',
    description:
      'Feel free to share how you give and receive feedback, coordinate with others, or adapt your style in group settings.',
    type: 'paragraph',
  }
];
