'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import {
    Link2,
    LayoutDashboard,
    LinkIcon,
    Palette,
    BarChart3,
    Settings,
    Menu,
    X,
    ExternalLink,
    Sun,
    Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardNavProps {
    user: {
        name?: string | null;
        email?: string | null;
        username?: string | null;
        image?: string | null;
    };
}

export default function DashboardNav({ user }: DashboardNavProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference and current class
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
            document.documentElement.classList.contains('dark')
        ) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/links', icon: LinkIcon, label: 'Links' },
        { href: '/dashboard/appearance', icon: Palette, label: 'Appearance' },
        { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    const profileUrl = user.username ? `/${user.username}` : null;

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300"></div>
                            <div className="absolute inset-[2px] rounded-[10px] bg-white dark:bg-[#0a0a0f] flex items-center justify-center">
                                <span className="text-lg font-black bg-gradient-to-br from-violet-500 to-pink-500 bg-clip-text text-transparent">M</span>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">
                            Mini<span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Link</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* View Profile Button */}
                        {profileUrl && (
                            <Link
                                href={profileUrl}
                                target="_blank"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                            >
                                View Profile
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        )}

                        {/* User menu */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </p>
                                {user.username && (
                                    <p className="text-xs text-gray-500">@{user.username}</p>
                                )}
                            </div>
                            <UserButton afterSignOutUrl="/" />
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 animate-slide-down">
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            {profileUrl && (
                                <Link
                                    href={profileUrl}
                                    target="_blank"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-primary-600 dark:text-primary-400"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    View Profile
                                </Link>
                            )}
                            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 mt-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account</span>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
