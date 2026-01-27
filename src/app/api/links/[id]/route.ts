import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        // Ensure the link exists and belongs to the user
        // Using updateMany is a safe way to ensure ownership without an extra fetch
        // But to return the updated object, we use update with a check or findFirst

        // First check ownership
        const existingLink = await prisma.link.findUnique({
            where: { id: params.id }
        });

        if (!existingLink || existingLink.userId !== userId) {
            return new NextResponse("Link not found", { status: 404 });
        }

        const link = await prisma.link.update({
            where: {
                id: params.id,
            },
            data: {
                ...body,
            },
        });

        return NextResponse.json(link);
    } catch (error) {
        console.error('[LINK_ID_PUT]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingLink = await prisma.link.findUnique({
            where: { id: params.id }
        });

        if (!existingLink || existingLink.userId !== userId) {
            return new NextResponse("Link not found", { status: 404 });
        }

        await prisma.link.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[LINK_ID_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
