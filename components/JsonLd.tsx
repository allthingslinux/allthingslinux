import React from 'react';

interface JsonLdProps {
  organizationSchema?: boolean;
  websiteSchema?: boolean;
  articleSchema?: {
    title: string;
    description: string;
    imageUrl: string;
    datePublished: string;
    dateModified: string;
    authorName: string;
  };
}

export default function JsonLd({
  organizationSchema = false,
  websiteSchema = false,
  articleSchema,
}: JsonLdProps) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'All Things Linux',
    url: 'https://allthingslinux.org',
    logo: 'https://allthingslinux.org/images/logo.png',
    sameAs: ['https://github.com/allthingslinux', 'https://discord.gg/linux'],
    description:
      'A 501(c)(3) non-profit organization empowering the Linux ecosystem through education, collaboration, and support.',
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'All Things Linux',
    url: 'https://allthingslinux.org',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://allthingslinux.org/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
      )}

      {websiteSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
      )}

      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: articleSchema.title,
              description: articleSchema.description,
              image: articleSchema.imageUrl,
              datePublished: articleSchema.datePublished,
              dateModified: articleSchema.dateModified,
              author: {
                '@type': 'Person',
                name: articleSchema.authorName,
              },
              publisher: {
                '@type': 'Organization',
                name: 'All Things Linux',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://allthingslinux.org/images/logo.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://allthingslinux.org',
              },
            }),
          }}
        />
      )}
    </>
  );
}
