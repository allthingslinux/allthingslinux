// @ts-check
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkGitContributors from 'remark-git-contributors';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkGitContributors],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
