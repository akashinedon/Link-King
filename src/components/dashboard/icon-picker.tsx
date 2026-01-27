'use client';

import { useState } from 'react';
import {
    Instagram,
    Youtube,
    Twitter,
    Github,
    Linkedin,
    Facebook,
    Globe,
    Mail,
    MessageCircle,
    Send,
    Music2,
    Twitch,
    Coffee,
    ShoppingBag,
    Link2,
    Upload
} from 'lucide-react';

const PRESET_ICONS = [
    { name: 'website', icon: Globe, label: 'Website' },
    { name: 'instagram', icon: Instagram, label: 'Instagram' },
    { name: 'youtube', icon: Youtube, label: 'YouTube' },
    { name: 'twitter', icon: Twitter, label: 'Twitter / X' },
    { name: 'github', icon: Github, label: 'GitHub' },
    { name: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { name: 'facebook', icon: Facebook, label: 'Facebook' },
    { name: 'email', icon: Mail, label: 'Email' },
    { name: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    { name: 'telegram', icon: Send, label: 'Telegram' },
    { name: 'spotify', icon: Music2, label: 'Spotify' },
    { name: 'twitch', icon: Twitch, label: 'Twitch' },
    { name: 'kofi', icon: Coffee, label: 'Ko-fi' },
    { name: 'shop', icon: ShoppingBag, label: 'Shop' },
    { name: 'link', icon: Link2, label: 'Custom Link' },
];

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
    const [customUrl, setCustomUrl] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Icon (Optional)</label>
            <div className="flex flex-wrap gap-2">
                {PRESET_ICONS.map(({ name, icon: Icon, label }) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => onChange(name)}
                        className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
              ${value === name
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }
            `}
                        title={label}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => setShowCustom(!showCustom)}
                    className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
            ${showCustom
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
          `}
                    title="Custom Icon"
                >
                    <Upload className="w-4 h-4" />
                </button>
            </div>

            {showCustom && (
                <div className="mt-3">
                    <input
                        type="url"
                        className="input-field"
                        placeholder="Paste custom icon URL (e.g., Cloudinary URL)"
                        value={customUrl}
                        onChange={(e) => {
                            setCustomUrl(e.target.value);
                            onChange(e.target.value);
                        }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Upload your icon to Cloudinary and paste the URL here
                    </p>
                </div>
            )}
        </div>
    );
}

export function getIconComponent(iconName: string | null) {
    if (!iconName) return Link2;

    const preset = PRESET_ICONS.find(i => i.name === iconName);
    if (preset) return preset.icon;

    // If it's a URL, return Link2 (will use img tag)
    if (iconName.startsWith('http')) return Link2;

    return Link2;
}
