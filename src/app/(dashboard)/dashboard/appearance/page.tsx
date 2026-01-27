'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, Check, Upload, Laptop, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import { useToast } from '@/components/ui/toaster';
import ProfilePreview from '@/components/dashboard/profile-preview';

const THEMES = [
    { id: 'default', name: 'Clean', preview: 'bg-gradient-to-br from-gray-100 to-gray-200' },
    { id: 'dark', name: 'Dark', preview: 'bg-gradient-to-br from-gray-900 to-gray-800' },
    { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'glass', name: 'Glass', preview: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { id: 'neon', name: 'Neon', preview: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-white border-2 border-gray-900' },
];

export default function AppearancePage() {
    const { user } = useUser();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        avatar: '',
        theme: 'default',
        links: [] as any[],
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const [profileRes, linksRes] = await Promise.all([
                fetch('/api/user/profile'),
                fetch('/api/links')
            ]);

            const profileData = await profileRes.json();
            const linksData = await linksRes.json();

            setProfile({
                name: profileData.name || '',
                bio: profileData.bio || '',
                avatar: profileData.avatar || '',
                theme: profileData.theme || 'default',
                links: Array.isArray(linksData) ? linksData.filter((l: any) => l.isActive) : [],
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    theme: profile.theme,
                }),
            });

            if (res.ok) {
                // Update Clerk user name if changed
                // Update Clerk user name if changed
                if (user && profile.name) {
                    const nameParts = profile.name.trim().split(/\s+/);
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                    await user.update({
                        firstName: firstName,
                        lastName: lastName,
                    });
                }

                router.refresh();
                addToast({
                    title: 'Success',
                    description: 'Your profile appearance has been updated.',
                    variant: 'success',
                });
            } else {
                addToast({
                    title: 'Error',
                    description: 'Failed to save changes. Please try again.',
                    variant: 'error',
                });
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            addToast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Appearance
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Customize how your profile looks
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Left Column - Editor */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Profile Section */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold mb-4">Profile</h2>

                        <div className="flex items-start gap-6 mb-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400">
                                    {profile.avatar ? (
                                        <Image
                                            src={profile.avatar}
                                            alt="Avatar"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                                            {(profile.name || user?.emailAddresses[0]?.emailAddress || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Avatar</label>
                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        className="input-field flex-1"
                                        placeholder="https://..."
                                        value={profile.avatar}
                                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                                    />
                                    <CldUploadButton
                                        uploadPreset="minilink_preset"
                                        onUpload={(result: any) => {
                                            if (result.info?.secure_url) {
                                                setProfile((prev) => ({ ...prev, avatar: result.info.secure_url }));
                                            }
                                        }}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Upload</span>
                                    </CldUploadButton>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload an image or paste a direct URL
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Display Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Your Name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Bio</label>
                                <textarea
                                    className="input-field min-h-[100px] resize-none"
                                    placeholder="Tell the world about yourself..."
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    maxLength={200}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {profile.bio.length}/200 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Theme Section */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold mb-4">Theme</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setProfile({ ...profile, theme: theme.id })}
                                    className={`
                        relative p-4 rounded-xl border-2 transition-all
                        ${profile.theme === theme.id
                                            ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }
                      `}
                                >
                                    <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview}`}></div>
                                    <p className="text-sm font-medium">{theme.name}</p>
                                    {profile.theme === theme.id && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary min-w-[140px]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="hidden lg:block lg:col-span-5">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Live Preview
                            </h3>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`p-2 rounded-md transition-all ${previewDevice === 'mobile'
                                        ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`p-2 rounded-md transition-all ${previewDevice === 'desktop'
                                        ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Laptop className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <ProfilePreview
                            device={previewDevice}
                            data={{
                                ...profile,
                                username: user?.username || '',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
