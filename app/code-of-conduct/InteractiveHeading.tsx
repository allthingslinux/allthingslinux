'use client';

import React from 'react';

const AnchorIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

interface InteractiveHeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id: string;
  marginClass: string;
  children: React.ReactNode;
}

const InteractiveHeading = ({
  level: Tag,
  id,
  marginClass,
  children,
}: InteractiveHeadingProps) => {
  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Tag
      id={id}
      className={`${marginClass} group relative hover:cursor-pointer flex items-center`}
    >
      <span className="flex-grow">{children}</span>
      <a
        href={`#${id}`}
        onClick={handleAnchorClick}
        className="ml-2 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-200 transition-all"
        aria-label="Copy link to section"
        title="Copy link to section"
      >
        <AnchorIcon />
      </a>
    </Tag>
  );
};

export default InteractiveHeading;
