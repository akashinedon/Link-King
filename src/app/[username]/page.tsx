import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import LinkButton from '@/components/link-button';
import ProfileLinks from '@/components/public-profile/profile-links';
import PromoFooter from '@/components/public-profile/promo-footer';

interface Props {
    params: { username: string };
}

export async function generateMetadata({ params }: Props) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        select: { name: true, bio: true, username: true },
    });

    if (!user) {
        return { title: 'User not found' };
    }

    return {
        title: `${user.name || user.username} | MiniLink`,
        description: user.bio || `Check out ${user.name || user.username}'s links`,
        openGraph: {
            title: `${user.name || user.username} | MiniLink`,
            description: user.bio || `Check out ${user.name || user.username}'s links`,
        },
    };
}

export default async function ProfilePage({ params }: Props) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        include: {
            links: {
                where: { isActive: true },
                orderBy: { order: 'asc' },
            },
        },
    });

    if (!user) {
        notFound();
    }

    // Record page view
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || null;
    const referer = headersList.get('referer') || null;

    await prisma.pageView.create({
        data: {
            userId: user.id,
            userAgent,
            referer,
        },
    });

    const themeClass = `theme-${user.theme || 'default'}`;

    return (
        <div className={`min-h-screen ${themeClass}`} style={{ background: 'var(--theme-bg)' }}>
            <div className="max-w-lg mx-auto px-4 py-12">
                {/* Profile Header */}
                <div
                    className="text-center mb-8 p-6 rounded-3xl backdrop-blur-lg animate-fade-in-up"
                    style={{
                        background: 'var(--theme-card)',
                        color: 'var(--theme-text)'
                    }}
                >
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-white/30">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={user.name || user.username || 'User'}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">
                                    {(user.name || user.username || 'U')[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <h1 className="text-2xl font-bold mb-1">
                        {user.name || `@${user.username}`}
                    </h1>
                    {user.bio && (
                        <p className="text-sm opacity-80 max-w-xs mx-auto">
                            {user.bio}
                        </p>
                    )}
                </div>

                {/* Links */}
                <ProfileLinks links={user.links} />

                {/* Footer - Promotional */}
                <PromoFooter />
            </div>
        </div>
    );
}
