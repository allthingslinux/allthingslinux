import Script from 'next/script';

interface ArticleSchema {
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}

export function OrganizationSchema() {
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

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

export function WebsiteSchema() {
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
    <Script
      id="website-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
}: ArticleSchema) {
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
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
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
    />
  );
}
