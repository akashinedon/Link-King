'use client';

import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 15_000;

interface LiveActivityBadgeProps {
    username: string;
}

export default function LiveActivityBadge({ username }: LiveActivityBadgeProps) {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchCount = async () => {
            try {
                const res = await fetch(`/api/activity/${username}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) setCount(data.count);
            } catch {
                // Silently ignore - this is a nice-to-have, not core functionality.
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [username]);

    if (!count || count < 1) return null;

    return (
        <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-lg"
            style={{
                background: 'var(--theme-link-bg)',
                border: '1px solid var(--theme-link-border)',
                color: 'var(--theme-text)',
            }}
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            {count} {count === 1 ? 'visit' : 'visits'} in the last 5 min
        </div>
    );
}
