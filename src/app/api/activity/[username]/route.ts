import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

const ACTIVITY_WINDOW_MS = 5 * 60_000;

// Public, read-only "live activity" signal for a profile - built entirely
// from PageView rows that are already being recorded (see [username]/page.tsx),
// so this adds no new tracking. It's a recent-activity proxy, not a literal
// concurrent-viewer count (the existing page-view rate limit already caps
// this to ~1 row per visitor per minute).
export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        const ip = getClientIp(request.headers);
        if (isRateLimited(`activity:${ip}:${params.username}`, 6, 60_000)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const user = await prisma.user.findUnique({
            where: { username: params.username },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ count: 0 });
        }

        const count = await prisma.pageView.count({
            where: {
                userId: user.id,
                createdAt: { gte: new Date(Date.now() - ACTIVITY_WINDOW_MS) },
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error fetching profile activity:', error);
        return NextResponse.json({ count: 0 });
    }
}
