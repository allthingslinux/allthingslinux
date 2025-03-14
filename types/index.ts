// types/index.ts

// Defines the individual question structure used throughout the application forms.
export type FormQuestion = {
  /** Unique identifier for the question used by react-hook-form and Zod */
  name: string;

  /** Displayed question or prompt label in the form */
  question: string;

  /** Question input type (determines rendered UI) */
  type: 'short' | 'paragraph' | 'select';

  /** Additional description or help text shown below the label */
  description?: string;

  /** Dropdown select options (only used if type is `select`) */
  options?: string[];

  /** Marks the question as optional or required */
  optional?: boolean;

  /** Number of rows for textarea (only used if type is `paragraph`) */
  rows?: number;

  /** Input type for short text fields (only used if type is `short`) */
  inputType?: 'text' | 'email' | 'tel' | 'url' | 'password';
};

/** Represents a single volunteer role available to applicants */
export type Role = {
  /** URL-friendly role identifier (slug) */
  slug: string;

  /** Display name shown for the role */
  name: string;

  /** Department to which this role belongs */
  department: string;

  /** Brief description of the role's purpose */
  description: string;

  /** List of questions specific to this role (including departmental & role-specific questions, excluding general questions) */
  questions: FormQuestion[];
};
