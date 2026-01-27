import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const links = await prisma.link.findMany({
            where: { userId },
            orderBy: { order: 'asc' },
        });

        return NextResponse.json(links);
    } catch (error) {
        console.error('[LINKS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, url, icon } = body;

        if (!title || !url) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Get last order to append to the end
        const lastLink = await prisma.link.findFirst({
            where: { userId },
            orderBy: { order: 'desc' },
        });

        const newOrder = lastLink ? lastLink.order + 1 : 0;

        const link = await prisma.link.create({
            data: {
                userId,
                title,
                url,
                icon,
                order: newOrder,
                isActive: true, // Default active
            },
        });

        return NextResponse.json(link);
    } catch (error) {
        console.error('[LINKS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { links } = body;

        if (!links || !Array.isArray(links)) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        // Update order for each link
        // Use Promise.all for parallel execution, but verify ownership
        await Promise.all(
            links.map((item: { id: string; order: number }) =>
                prisma.link.updateMany({
                    where: {
                        id: item.id,
                        userId: userId, // Security: ensure user owns the link
                    },
                    data: {
                        order: item.order,
                    },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[LINKS_REORDER]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
