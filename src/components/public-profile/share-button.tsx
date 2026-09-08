'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    text: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        // Prefer the native share sheet on supported devices, fall back to
        // clipboard copy everywhere else (matches src/components/dashboard/copy-button.tsx).
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return;
            } catch {
                // User dismissed the share sheet - fall through to copy.
            }
        }

        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-lg transition-colors"
            style={{
                background: 'var(--theme-link-bg)',
                border: '1px solid var(--theme-link-border)',
                color: 'var(--theme-text)',
            }}
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    Link copied!
                </>
            ) : (
                <>
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                </>
            )}
        </button>
    );
}
