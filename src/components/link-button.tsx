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
    isFeatured?: boolean;
}

export default function LinkButton({
    link,
    icon,
    isFeatured = false,
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
            className={`relative block w-full rounded-2xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden ${
                isFeatured
                    ? 'p-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 shadow-lg hover:shadow-xl'
                    : 'p-4 hover:shadow-lg'
            }`}
            style={
                isFeatured
                    ? undefined
                    : {
                          background: 'var(--theme-link-bg)',
                          border: '1px solid var(--theme-link-border)',
                          color: 'var(--theme-text)',
                      }
            }
        >
            <div
                className={isFeatured ? 'relative rounded-[14px] p-4' : 'contents'}
                style={
                    isFeatured
                        ? { background: 'var(--theme-link-bg)', color: 'var(--theme-text)' }
                        : undefined
                }
            >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-[-15deg] group-hover:animate-shine" />

                <div className="relative flex items-center justify-center gap-3">
                    {icon}
                    <span className="font-semibold">{link.title}</span>
                    {isFeatured && (
                        <span className="text-[10px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                            Featured
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}
