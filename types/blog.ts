export interface Post {
  slug: string;
  title: string;
  description: string;
  author: string;
  dateFormatted: string;
  date: string;
  category: string;
  categorySlug: string;
  content: string;
  image?: string; // Optional featured image URL
}
