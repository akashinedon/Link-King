import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { linkCreateSchema, linksReorderSchema, firstZodError } from '@/lib/validations';

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
        const parsed = linkCreateSchema.safeParse(body);

        if (!parsed.success) {
            return new NextResponse(firstZodError(parsed.error), { status: 400 });
        }

        const { title, url, icon } = parsed.data;

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
        const parsed = linksReorderSchema.safeParse(body);

        if (!parsed.success) {
            return new NextResponse(firstZodError(parsed.error), { status: 400 });
        }

        const { links } = parsed.data;

        // Update order for each link
        // Use Promise.all for parallel execution, but verify ownership
        await Promise.all(
            links.map((item) =>
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
