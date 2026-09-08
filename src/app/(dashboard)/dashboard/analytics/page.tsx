import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { Eye, MousePointer, TrendingUp, BarChart3 } from 'lucide-react';
import AnalyticsCharts from '@/components/dashboard/analytics-charts';
import AnalyticsRangeTabs from '@/components/dashboard/analytics-range-tabs';
import { DeviceBreakdownChart, HorizontalBarBreakdownChart, type BreakdownItem } from '@/components/dashboard/breakdown-charts';
import { parseDevice } from '@/lib/device';
import { parseReferrer } from '@/lib/referrer';

const VALID_RANGES = ['7', '30', '90'] as const;

/** Counts occurrences per bucket and returns the top N as chart-ready items. */
function topBreakdown(values: (string | null)[], limit = 6): BreakdownItem[] {
    const counts = new Map<string, number>();
    for (const value of values) {
        const key = value || 'Unknown';
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
}

interface Props {
    searchParams: { range?: string };
}

export default async function AnalyticsPage({ searchParams }: Props) {
    const { userId } = auth();

    if (!userId) {
        return null;
    }

    const range = VALID_RANGES.includes(searchParams.range as any) ? searchParams.range! : '30';
    const days = parseInt(range, 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
        totalViews,
        totalClicks,
        links,
        recentPageViews,
        recentClicks,
    ] = await Promise.all([
        prisma.pageView.count({
            where: { userId: userId },
        }),
        prisma.link.aggregate({
            where: { userId: userId },
            _sum: { clicks: true },
        }),
        prisma.link.findMany({
            where: { userId: userId },
            orderBy: { clicks: 'desc' },
            select: { id: true, title: true, clicks: true, url: true },
        }),
        prisma.pageView.findMany({
            where: {
                userId: userId,
                createdAt: { gte: startDate },
            },
            select: { createdAt: true, country: true, referer: true },
            orderBy: { createdAt: 'asc' },
        }),
        prisma.click.findMany({
            where: {
                link: { userId: userId },
                createdAt: { gte: startDate },
            },
            select: { createdAt: true, userAgent: true },
            orderBy: { createdAt: 'asc' },
        }),
    ]);

    // Aggregate data by day
    const dayData: Record<string, { views: number; clicks: number }> = {};

    // Initialize the selected range
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        dayData[key] = { views: 0, clicks: 0 };
    }

    // Count views per day
    recentPageViews.forEach((view) => {
        const key = view.createdAt.toISOString().split('T')[0];
        if (dayData[key]) {
            dayData[key].views++;
        }
    });

    // Count clicks per day
    recentClicks.forEach((click) => {
        const key = click.createdAt.toISOString().split('T')[0];
        if (dayData[key]) {
            dayData[key].clicks++;
        }
    });

    // Convert to array and sort
    const chartData = Object.entries(dayData)
        .map(([date, data]) => ({
            date,
            views: data.views,
            clicks: data.clicks,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Turn the previously write-only userAgent/referer/country columns into
    // actual breakdown charts.
    const deviceBreakdown = topBreakdown(recentClicks.map((c) => parseDevice(c.userAgent)));
    const referrerBreakdown = topBreakdown(recentPageViews.map((v) => parseReferrer(v.referer)));
    const countryBreakdown = topBreakdown(recentPageViews.map((v) => v.country));

    const stats = [
        {
            label: 'Total Views',
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
            label: 'CTR',
            value: totalViews > 0
                ? `${(((totalClicks._sum.clicks || 0) / totalViews) * 100).toFixed(1)}%`
                : '0%',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500'
        },
        {
            label: 'Avg. Clicks/Link',
            value: links.length > 0
                ? ((totalClicks._sum.clicks || 0) / links.length).toFixed(1)
                : '0',
            icon: BarChart3,
            color: 'from-orange-500 to-red-500'
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Track your profile performance over the last {days} days
                    </p>
                </div>
                <AnalyticsRangeTabs active={range} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="card p-6"
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

            {/* Charts */}
            <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Views & Clicks Over Time</h2>
                <AnalyticsCharts data={chartData} />
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Devices</h2>
                    <DeviceBreakdownChart data={deviceBreakdown} />
                </div>
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Top Traffic Sources</h2>
                    <HorizontalBarBreakdownChart data={referrerBreakdown} />
                </div>
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Top Countries</h2>
                    <HorizontalBarBreakdownChart data={countryBreakdown} />
                </div>
            </div>

            {/* Top Links */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold mb-4">Link Performance</h2>
                {links.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No links yet. Add some links to see their performance.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {links.map((link, index) => {
                            const percentage = totalClicks._sum.clicks
                                ? ((link.clicks / (totalClicks._sum.clicks || 1)) * 100).toFixed(1)
                                : '0';

                            return (
                                <div key={link.id} className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium truncate">{link.title}</p>
                                            <span className="text-sm text-gray-500">
                                                {link.clicks} clicks ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


        </div>
    );
}
