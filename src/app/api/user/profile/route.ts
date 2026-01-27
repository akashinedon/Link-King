import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

// GET user profile
export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                bio: true,
                avatar: true,
                theme: true,
            },
        });

        // Sync user if not found in database
        if (!user) {
            const clerkUser = await currentUser();
            if (clerkUser) {
                const email = clerkUser.emailAddresses[0]?.emailAddress;
                // Ensure email is available
                if (!email) {
                    return NextResponse.json({ error: 'Email required' }, { status: 400 });
                }

                user = await prisma.user.create({
                    data: {
                        id: userId,
                        email: email,
                        username: clerkUser.username || email.split('@')[0],
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                        avatar: clerkUser.imageUrl,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        bio: true,
                        avatar: true,
                        theme: true,
                    },
                });
            }
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PUT update profile
export async function PUT(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, bio, avatar, theme, username } = await request.json();

        // If username is being changed, check uniqueness
        if (username) {
            const existing = await prisma.user.findFirst({
                where: {
                    username: {
                        equals: username,
                        mode: 'insensitive', // Case insensitive check
                    },
                    NOT: { id: userId },
                },
            });

            if (existing) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name !== undefined && { name }),
                ...(bio !== undefined && { bio }),
                ...(avatar !== undefined && { avatar }),
                ...(theme !== undefined && { theme }),
                ...(username !== undefined && { username }),
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
