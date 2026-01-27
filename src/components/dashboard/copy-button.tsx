'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
}
