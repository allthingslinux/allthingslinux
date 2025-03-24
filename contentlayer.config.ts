import { defineDocumentType, makeSource } from 'contentlayer2/source-files';

// Define the Blog Post document type
export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    author: {
      type: 'string',
      required: true,
      default: 'All Things Linux',
    },
    date: {
      type: 'date',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
    categorySlug: {
      type: 'string',
      resolve: (doc) => {
        const category = doc.category || 'Uncategorized';
        return category.toLowerCase().replace(/ /g, '-');
      },
    },
    url: {
      type: 'string',
      resolve: (doc) => {
        const categorySlug = doc.category
          ? doc.category.toLowerCase().replace(/ /g, '-')
          : 'uncategorized';
        const slug = doc._raw.sourceFileName.replace(/\.mdx$/, '');
        return `/blog/${categorySlug}/${slug}`;
      },
    },
    dateFormatted: {
      type: 'string',
      resolve: (doc) => {
        try {
          const date = new Date(doc.date);
          // Use a more stable approach for date formatting
          const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        } catch (e) {
          console.error('Error formatting date:', e);
          return doc.date;
        }
      },
    },
  },
}));

// Create the contentlayer source
export default makeSource({
  contentDirPath: 'content',
  documentTypes: [BlogPost],
  mdx: {
    esbuildOptions: (options) => {
      options.external = ['@/components/*', ...(options.external || [])];
      return options;
    },
  },
  disableImportAliasWarning: false,
});
