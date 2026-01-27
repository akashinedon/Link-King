'use client';

import Image from 'next/image';
import { Link2 } from 'lucide-react';

interface LinkButtonProps {
    link: {
        id: string;
        url: string;
        title: string;
    };
    icon: React.ReactNode;
}

export default function LinkButton({
    link,
    icon
}: LinkButtonProps) {
    const handleClick = async () => {
        // Track click - fire and forget
        try {
            fetch(`/api/track/${link.id}`, { method: 'POST' });
        } catch (error) {
            console.error('Failed to track click', error);
        }
    };

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="relative block w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group overflow-hidden"
            style={{
                background: 'var(--theme-link-bg)',
                border: '1px solid var(--theme-link-border)',
                color: 'var(--theme-text)',
            }}
        >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-[-15deg] group-hover:animate-shine" />

            <div className="relative flex items-center justify-center gap-3">
                {icon}
                <span className="font-medium">{link.title}</span>
            </div>
        </a>
    );
}
