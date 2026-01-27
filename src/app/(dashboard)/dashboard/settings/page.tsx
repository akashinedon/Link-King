'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Loader2, AlertTriangle, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function SettingsPage() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { addToast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [username, setUsername] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            setUsername(data.username || '');
            setOriginalUsername(data.username || '');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveUsername = async () => {
        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to update username');
                return;
            }

            setOriginalUsername(username);
            router.refresh();

            addToast({
                title: 'Success',
                description: 'Username updated successfully.',
                variant: 'success',
            });

            // Optionally update Clerk username if you want to sync, 
            // but for now we are syncing local DB username.
            if (user) {
                try {
                    await user.update({ username });
                } catch (clerkError) {
                    // Ignore Clerk update errors as long as our DB is updated
                    console.warn('Clerk username sync failed:', clerkError);
                }
            }

        } catch (error) {
            setError('Something went wrong');
            addToast({
                title: 'Error',
                description: 'Failed to update username.',
                variant: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const profileUrl = username
        ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/${username}`
        : '';

    const displayDomain = process.env.NEXT_PUBLIC_APP_URL
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, '')
        : 'minilink.app';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Username Section */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Your MiniLink URL</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <div className="flex gap-3">
                        <div className="flex-1 flex items-center">
                            <span className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-gray-500 text-sm">
                                {displayDomain}/
                            </span>
                            <input
                                type="text"
                                className="flex-1 input-field rounded-l-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                placeholder="username"
                            />
                        </div>
                        <button
                            onClick={handleSaveUsername}
                            disabled={isSaving || username === originalUsername}
                            className="btn-primary disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>

                {profileUrl && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="flex-1 text-sm truncate">{profileUrl}</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Account Section */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Account</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-gray-900 dark:text-white">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card p-6 border-red-200 dark:border-red-900">
                <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                </h2>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Sign out of all devices</p>
                        <p className="text-sm text-gray-500">
                            This will sign you out of your current session
                        </p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>


        </div>
    );
}
