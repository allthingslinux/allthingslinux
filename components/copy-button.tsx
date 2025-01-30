'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      className="absolute right-4 top-4 z-20 h-8 w-8 rounded-md border border-[#292e42] bg-[#1a1b26] p-1.5 hover:bg-[#292e42]"
      onClick={copy}
    >
      {isCopied ? (
        <Check className="h-full w-full text-green-500" />
      ) : (
        <Copy className="h-full w-full text-[#565f89]" />
      )}
    </button>
  );
}
