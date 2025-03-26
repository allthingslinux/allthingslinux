// Form data types
export type FormData = {
  discord_username: string;
  discord_id: string;
  [key: string]: string;
};

// Question type
export type Question = {
  name: string;
  question: string;
  optional?: boolean;
  type?: string;
  description?: string;
  options?: string[];
};

// Role type
export type Role = {
  name: string;
  slug: string;
  department: string;
  description: string;
  questions: Question[];
  generalQuestions: Question[]; // Reference to general questions for processing
};
