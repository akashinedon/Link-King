import { auth, currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
    Link2,
    ArrowUpRight,
    Eye,
    MousePointer,
    TrendingUp,
    Plus,
    Copy,
    Check
} from 'lucide-react';
import CopyButton from '@/components/dashboard/copy-button';

export default async function DashboardPage() {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
        return null;
    }

    // Ensure user exists in Prisma
    let dbUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!dbUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (email) {
            // Check for existing user with same email (Legacy/NextAuth user)
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // User exists but with different ID -> Migrate them
                const timestamp = Date.now();

                // 1. Rename old email AND username to free up unique constraints
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        email: `${email}.migrated.${timestamp}`,
                        username: `${existingUser.username || 'user'}_migrated_${timestamp}`
                    }
                });

                // 2. Create new user with Clerk ID
                dbUser = await prisma.user.create({
                    data: {
                        id: userId,
                        email: email,
                        username: existingUser.username, // Keep original username
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                        avatar: clerkUser.imageUrl,
                    }
                });

                // 3. Move data (Links, PageViews) to new user
                await prisma.link.updateMany({
                    where: { userId: existingUser.id },
                    data: { userId: userId }
                });
                await prisma.pageView.updateMany({
                    where: { userId: existingUser.id },
                    data: { userId: userId }
                });

                // 4. Delete old user (now empty of relations)
                await prisma.user.delete({
                    where: { id: existingUser.id }
                });

            } else {
                // Completely new user
                dbUser = await prisma.user.create({
                    data: {
                        id: userId,
                        email: email,
                        username: clerkUser.username || email.split('@')[0],
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                        avatar: clerkUser.imageUrl,
                    }
                });
            }
        }
    }

    const [user, links, totalViews, totalClicks] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, name: true, createdAt: true },
        }),
        prisma.link.findMany({
            where: { userId: userId },
            orderBy: { clicks: 'desc' },
            take: 5,
        }),
        prisma.pageView.count({
            where: { userId: userId },
        }),
        prisma.link.aggregate({
            where: { userId: userId },
            _sum: { clicks: true },
        }),
    ]);

    const profileUrl = user?.username
        ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://minilink.app'}/${user.username}`
        : null;

    const stats = [
        {
            label: 'Profile Views',
            value: totalViews,
            icon: Eye,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Total Clicks',
            value: totalClicks._sum.clicks || 0,
            icon: MousePointer,
            color: 'from-purple-500 to-pink-500'
        },
        {
            label: 'Total Links',
            value: links.length,
            icon: Link2,
            color: 'from-orange-500 to-red-500'
        },
        {
            label: 'CTR',
            value: totalViews > 0
                ? `${(((totalClicks._sum.clicks || 0) / totalViews) * 100).toFixed(1)}%`
                : '0%',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500'
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {dbUser?.name || clerkUser.firstName}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here is how your MiniLink is performing
                </p>
            </div>

            {/* Profile URL Card */}
            {profileUrl && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-white/80 mb-1">Your MiniLink URL</p>
                            <p className="text-xl font-bold break-all">{profileUrl}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <CopyButton text={profileUrl} />
                            <Link
                                href={`/${user?.username}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                <span>Visit</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="card p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Top Links */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/links"
                            className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="font-medium text-sm">Add New Link</span>
                        </Link>
                        <Link
                            href="/dashboard/appearance"
                            className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <span className="font-medium text-sm">Customize Theme</span>
                        </Link>
                    </div>
                </div>

                {/* Top Links */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Top Performing Links</h2>
                        <Link
                            href="/dashboard/analytics"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    {links.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No links yet</p>
                            <Link
                                href="/dashboard/links"
                                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                            >
                                Add your first link
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {links.slice(0, 5).map((link, index) => (
                                <div
                                    key={link.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <p className="font-medium text-sm truncate max-w-[200px]">
                                                {link.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {link.url}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MousePointer className="w-4 h-4" />
                                        <span className="text-sm font-medium">{link.clicks}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}
