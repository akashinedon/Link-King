import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';
import { getCountryFromHeaders } from '@/lib/geo';

// POST track click
export async function POST(
    request: NextRequest,
    { params }: { params: { linkId: string } }
) {
    try {
        const headersList = request.headers;
        const userAgent = headersList.get('user-agent') || null;
        const referer = headersList.get('referer') || null;
        const country = getCountryFromHeaders(headersList);

        // This is a public, unauthenticated endpoint (anyone with a linkId can
        // hit it), so rate-limit per IP+link to blunt click-fraud/spam before
        // it ever reaches the database. See src/lib/rate-limit.ts for caveats.
        const ip = getClientIp(headersList);
        if (isRateLimited(`click:${ip}:${params.linkId}`, 5, 60_000)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        // Confirm the link exists and is currently visible before counting it,
        // instead of trusting a client-supplied linkId blindly.
        const link = await prisma.link.findUnique({
            where: { id: params.linkId },
            select: { id: true, isActive: true },
        });

        if (!link || !link.isActive) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // Create click record
        await prisma.click.create({
            data: {
                linkId: params.linkId,
                userAgent,
                referer,
                country,
            },
        });

        // Increment click count on link (denormalized for performance)
        await prisma.link.update({
            where: { id: params.linkId },
            data: { clicks: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking click:', error);
        return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
    }
}
