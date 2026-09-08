'use client';

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

export interface BreakdownItem {
    name: string;
    value: number;
}

const PIE_COLORS = ['#0ea5e9', '#d946ef', '#f97316', '#22c55e', '#a855f7'];

function EmptyState() {
    return (
        <div className="h-[240px] flex items-center justify-center text-gray-500 text-sm">
            No data available yet
        </div>
    );
}

export function DeviceBreakdownChart({ data }: { data: BreakdownItem[] }) {
    if (data.length === 0) return <EmptyState />;

    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function HorizontalBarBreakdownChart({ data }: { data: BreakdownItem[] }) {
    if (data.length === 0) return <EmptyState />;

    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        width={100}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
