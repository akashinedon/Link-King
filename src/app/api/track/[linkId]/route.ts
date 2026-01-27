import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST track click
export async function POST(
    request: NextRequest,
    { params }: { params: { linkId: string } }
) {
    try {
        const headersList = request.headers;
        const userAgent = headersList.get('user-agent') || null;
        const referer = headersList.get('referer') || null;

        // Create click record
        await prisma.click.create({
            data: {
                linkId: params.linkId,
                userAgent,
                referer,
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
