'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';

type CodeBlockProps = {
  language: string;
  filename: string;
  highlightLines?: number[];
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = useMemo(
    () => (tabsExist ? tabs[activeTab].code : code),
    [tabsExist, tabs, activeTab, code]
  );

  const activeLanguage = useMemo(
    () => (tabsExist ? tabs[activeTab].language || language : language),
    [tabsExist, tabs, activeTab, language]
  );

  const activeHighlightLines = useMemo(
    () => (tabsExist ? tabs[activeTab].highlightLines || [] : highlightLines),
    [tabsExist, tabs, activeTab, highlightLines]
  );

  useEffect(() => {
    // Simple syntax highlighting function that doesn't rely on external libraries
    const highlightCode = () => {
      if (!activeCode) {
        setHighlightedCode('<pre><code>No code content available</code></pre>');
        return;
      }

      try {
        // Create a simple highlighted HTML with line numbers
        const lines = activeCode.split('\n');
        let html = '<pre class="shiki"><code>';

        lines.forEach((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = activeHighlightLines.includes(lineNumber);
          const lineClass = isHighlighted ? 'line highlighted-line' : 'line';

          // Escape HTML characters
          const escapedLine = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

          html += `<span class="${lineClass}">${escapedLine}</span>`;
        });

        html += '</code></pre>';
        setHighlightedCode(html);
        setError(null);
      } catch (err) {
        // Safe error logging without accessing err.stack
        console.error(
          'Failed to highlight code:',
          err instanceof Error ? err.message : 'Unknown error'
        );

        setError('Failed to highlight code. Displaying plain text instead.');

        // Fallback to plain text with safe HTML escaping
        try {
          const escapedCode = activeCode
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`);
        } catch (escapeErr) {
          // If even the escaping fails, use a very simple fallback
          setHighlightedCode(`<pre><code>Code rendering failed</code></pre>`);
          setError(
            escapeErr instanceof Error
              ? escapeErr.message
              : 'Unknown error during code highlighting'
          );
        }
      }
    };

    highlightCode();
  }, [activeCode, activeLanguage, activeHighlightLines]);

  return (
    <div className="relative w-full rounded-lg bg-slate-900 p-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 !py-2 text-xs transition-colors font-sans ${
                  activeTab === index
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {filename && (
          <div className="flex justify-between items-center py-2">
            <div className="text-xs text-zinc-400">{filename}</div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </div>
        )}
      </div>

      {error ? (
        <div className="py-4 text-red-400">{error}</div>
      ) : (
        <div
          className="shiki-container"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          style={{
            fontSize: '0.875rem',
          }}
        />
      )}

      <style jsx global>{`
        .shiki-container {
          background: transparent;
          margin: 0;
          padding: 0;
          overflow-x: auto;
        }
        .shiki-container pre {
          margin: 0;
          padding: 0;
        }
        .shiki-container .line {
          display: block;
          width: 100%;
        }
        .shiki-container .highlighted-line {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .shiki-container code {
          counter-reset: line;
        }
        .shiki-container .line::before {
          counter-increment: line;
          content: counter(line);
          display: inline-block;
          width: 1.5rem;
          margin-right: 1rem;
          text-align: right;
          color: rgba(115, 138, 148, 0.4);
        }
      `}</style>
    </div>
  );
};
