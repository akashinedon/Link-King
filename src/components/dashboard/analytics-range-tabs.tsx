import Link from 'next/link';

const RANGES = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
] as const;

interface AnalyticsRangeTabsProps {
    active: string;
}

export default function AnalyticsRangeTabs({ active }: AnalyticsRangeTabsProps) {
    return (
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            {RANGES.map(({ value, label }) => (
                <Link
                    key={value}
                    href={`/dashboard/analytics?range=${value}`}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        active === value
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                >
                    {label}
                </Link>
            ))}
        </div>
    );
}
