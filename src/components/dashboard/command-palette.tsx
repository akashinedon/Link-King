'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Command } from 'cmdk';
import {
    LayoutDashboard,
    LinkIcon,
    Palette,
    BarChart3,
    Settings,
    Plus,
    Copy,
    ExternalLink,
    Sun,
    Moon,
    LogOut,
    Search,
} from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    username?: string | null;
    isDark: boolean;
    onToggleTheme: () => void;
}

export default function CommandPalette({ open, onOpenChange, username, isDark, onToggleTheme }: CommandPaletteProps) {
    const router = useRouter();
    const { signOut } = useClerk();
    const { addToast } = useToast();

    const runAndClose = useCallback(
        (action: () => void) => {
            action();
            onOpenChange(false);
        },
        [onOpenChange]
    );

    // Rendered inside DashboardNav, which the server also renders for the
    // initial HTML, so `window` isn't available yet at that point - bail out
    // before touching it and only build this once the palette is actually
    // open (i.e. after a client-side keydown).
    if (!open) return null;

    const profileUrl = username ? `${window.location.origin}/${username}` : null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
        >
            <Command
                className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
                loop
            >
                <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-gray-800">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <Command.Input
                        autoFocus
                        placeholder="Type a command or search..."
                        className="w-full py-3.5 bg-transparent outline-none text-sm placeholder:text-gray-400"
                    />
                    <kbd className="hidden sm:block text-[10px] font-medium px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-400">
                        Esc
                    </kbd>
                </div>

                <Command.List className="max-h-80 overflow-y-auto p-2">
                    <Command.Empty className="py-8 text-center text-sm text-gray-500">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigate" className="text-xs font-medium text-gray-400 px-2 py-1.5 [&_[cmdk-group-items]]:mt-1">
                        {[
                            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                            { label: 'Links', href: '/dashboard/links', icon: LinkIcon },
                            { label: 'Appearance', href: '/dashboard/appearance', icon: Palette },
                            { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
                            { label: 'Settings', href: '/dashboard/settings', icon: Settings },
                        ].map(({ label, href, icon: Icon }) => (
                            <Command.Item
                                key={href}
                                onSelect={() => runAndClose(() => router.push(href))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                            >
                                <Icon className="w-4 h-4 text-gray-500" />
                                {label}
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Actions" className="text-xs font-medium text-gray-400 px-2 py-1.5 [&_[cmdk-group-items]]:mt-1">
                        <Command.Item
                            onSelect={() => runAndClose(() => router.push('/dashboard/links?new=1'))}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                        >
                            <Plus className="w-4 h-4 text-gray-500" />
                            Add a new link
                        </Command.Item>

                        {profileUrl && (
                            <Command.Item
                                onSelect={() =>
                                    runAndClose(async () => {
                                        await navigator.clipboard.writeText(profileUrl);
                                        addToast({ title: 'Copied', description: 'Profile URL copied to clipboard.', variant: 'success' });
                                    })
                                }
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                            >
                                <Copy className="w-4 h-4 text-gray-500" />
                                Copy profile URL
                            </Command.Item>
                        )}

                        {username && (
                            <Command.Item
                                onSelect={() => runAndClose(() => window.open(`/${username}`, '_blank'))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                            >
                                <ExternalLink className="w-4 h-4 text-gray-500" />
                                View public profile
                            </Command.Item>
                        )}

                        <Command.Item
                            onSelect={() => runAndClose(onToggleTheme)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                        >
                            {isDark ? <Sun className="w-4 h-4 text-gray-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
                            Toggle {isDark ? 'light' : 'dark'} mode
                        </Command.Item>

                        <Command.Item
                            onSelect={() => runAndClose(() => signOut())}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-red-500 aria-selected:bg-red-50 dark:aria-selected:bg-red-900/20"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}
