import Link from 'next/link';
import Image from 'next/image';
import { Trophy, ArrowLeft, Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata = {
    title: 'Trending Profiles | MiniLink',
    description: 'The most-viewed MiniLink profiles this week.',
};

// Rendered per-request rather than cached at build time, so rankings stay
// current without needing a redeploy.
export const dynamic = 'force-dynamic';

const WINDOW_DAYS = 7;
const LIMIT = 20;

export default async function LeaderboardPage() {
    const since = new Date();
    since.setDate(since.getDate() - WINDOW_DAYS);

    // Aggregate first (cheap, indexed on userId+createdAt), then filter down
    // to users who opted in and still have a public username.
    const grouped = await prisma.pageView.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: since } },
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } },
        take: LIMIT * 2, // headroom for users filtered out below
    });

    const users = await prisma.user.findMany({
        where: {
            id: { in: grouped.map((g) => g.userId) },
            username: { not: null },
            showOnLeaderboard: true,
        },
        select: { id: true, username: true, name: true, avatar: true, bio: true },
    });
    const usersById = new Map(users.map((u) => [u.id, u]));

    const ranked = grouped
        .map((g) => ({ user: usersById.get(g.userId), views: g._count.userId }))
        .filter((entry): entry is { user: NonNullable<typeof entry.user>; views: number } => !!entry.user)
        .slice(0, LIMIT);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back home
                </Link>

                <div className="text-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Profiles</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        The most-viewed MiniLink profiles in the last {WINDOW_DAYS} days
                    </p>
                </div>

                {ranked.length === 0 ? (
                    <div className="card p-12 text-center text-gray-500">
                        No profile views yet this week - check back soon.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {ranked.map(({ user, views }, index) => (
                            <Link
                                key={user.id}
                                href={`/${user.username}`}
                                className="card p-4 flex items-center gap-4 hover:border-primary-500/50 transition-colors"
                            >
                                <span
                                    className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                                        index < 3
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}
                                >
                                    {index + 1}
                                </span>

                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 shrink-0">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt={user.name || user.username || ''} width={40} height={40} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                            {(user.name || user.username || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{user.name || `@${user.username}`}</p>
                                    {user.bio && <p className="text-sm text-gray-500 truncate">{user.bio}</p>}
                                </div>

                                <div className="flex items-center gap-1.5 text-sm text-gray-500 shrink-0">
                                    <Eye className="w-4 h-4" />
                                    {views}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
