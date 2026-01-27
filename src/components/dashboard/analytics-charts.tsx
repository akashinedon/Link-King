'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface ChartData {
    date: string;
    views: number;
    clicks: number;
}

interface AnalyticsChartsProps {
    data: ChartData[];
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available yet
            </div>
        );
    }

    // Format dates for display
    const formattedData = data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }),
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="Views"
                    />
                    <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#d946ef"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                        name="Clicks"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
