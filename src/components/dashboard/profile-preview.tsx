'use client';

import { useState, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import Image from 'next/image';
import PromoFooter from '@/components/public-profile/promo-footer';
import LinkButton from '@/components/link-button';

// Icon map for preview (simplified version of the main one)
import {
    Instagram, Youtube, Twitter, Github, Linkedin, Facebook,
    Globe, Mail, MessageCircle, Send, Music2, Twitch,
    Coffee, ShoppingBag
} from 'lucide-react';

const iconMap: Record<string, any> = {
    website: Globe, instagram: Instagram, youtube: Youtube, twitter: Twitter,
    github: Github, linkedin: Linkedin, facebook: Facebook, email: Mail,
    whatsapp: MessageCircle, telegram: Send, spotify: Music2, twitch: Twitch,
    kofi: Coffee, shop: ShoppingBag, link: Link2,
};

interface ProfilePreviewProps {
    data: {
        name: string;
        username: string;
        bio: string;
        avatar: string;
        theme: string;
        links: any[];
    };
    device?: 'mobile' | 'desktop';
}

export default function ProfilePreview({ data, device = 'mobile' }: ProfilePreviewProps) {
    const themeClass = `theme-${data.theme || 'default'}`;
    const isMobile = device === 'mobile';
    const [domain, setDomain] = useState('minilink.app');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDomain(window.location.host);
        }
    }, []);

    // The content inside the device screen
    const screenContent = (
        <div className={`w-full h-full overflow-y-auto hide-scrollbar ${themeClass}`} style={{ background: 'var(--theme-bg)' }}>
            <div className={`px-4 py-12 flex flex-col min-h-full ${!isMobile ? 'items-center max-w-sm mx-auto' : ''}`}>

                {/* Header */}
                <div
                    className="text-center mb-6 p-4 rounded-3xl backdrop-blur-lg w-full"
                    style={{
                        background: 'var(--theme-card)',
                        color: 'var(--theme-text)'
                    }}
                >
                    <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden ring-4 ring-white/30">
                        {data.avatar ? (
                            <Image
                                src={data.avatar}
                                alt="Avatar"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {(data.name || data.username || 'U')[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-lg font-bold mb-1 line-clamp-1">
                        {data.name || `@${data.username || 'username'}`}
                    </h2>
                    {data.bio && (
                        <p className="text-xs opacity-80 line-clamp-3">
                            {data.bio}
                        </p>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-3 flex-1 w-full">
                    {data.links?.map((link) => {
                        const IconComponent = link.icon ? iconMap[link.icon] : Link2;
                        const isCustomIcon = link.icon?.startsWith('http');

                        return (
                            <LinkButton
                                key={link.id}
                                link={{
                                    id: link.id,
                                    url: link.url,
                                    title: link.title
                                }}
                                icon={
                                    isCustomIcon && link.icon ? (
                                        <Image
                                            src={link.icon}
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 object-contain"
                                        />
                                    ) : (
                                        <IconComponent className="w-5 h-5" />
                                    )
                                }
                            />
                        );
                    })}

                    {(!data.links || data.links.length === 0) && (
                        <div className="text-center p-4 opacity-50 text-sm" style={{ color: 'var(--theme-text)' }}>
                            No links added yet
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="scale-90 origin-bottom">
                        <PromoFooter />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`
            ${isMobile
                ? 'border-[12px] border-gray-900 rounded-[3rem] max-w-[320px] aspect-[9/19] bg-gray-900 shadow-2xl overflow-hidden'
                : 'w-full max-w-4xl mx-auto transform scale-[0.85] sm:scale-100 transition-transform'
            } 
            relative transition-all duration-300 mx-auto
        `}>
            {isMobile ? (
                <>
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>
                    {/* Screen Content for Mobile */}
                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                        {screenContent}
                    </div>
                </>
            ) : (
                // Laptop Frame (High Fidelity)
                <div className="relative">
                    {/* Laptop Screen Frame */}
                    <div className="relative bg-gray-900 rounded-t-xl p-2 shadow-2xl mx-auto z-10">
                        {/* Camera */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full z-20"></div>

                        {/* Screen Content Container */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative z-10">
                            {/* Browser Chrome */}
                            <div className="h-7 bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 flex items-center px-3 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-[#E0443E]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] border border-[#D89E24]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-[#1AAB29]"></div>
                                </div>
                                {/* Address Bar */}
                                <div className="flex-1 mx-2">
                                    <div className="bg-white dark:bg-gray-800 rounded-md h-5 flex items-center px-2 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="flex-1 flex items-center gap-1 text-[10px] text-gray-500">
                                            <span className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span>
                                            <span className="truncate">
                                                {domain}
                                                /{data.username || 'username'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actual Preview Area */}
                            <div className="aspect-video w-full bg-white dark:bg-gray-950 pointer-events-auto overflow-hidden">
                                <div className="w-[200%] h-[200%] origin-top-left transform scale-50">
                                    {screenContent}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Laptop Base */}
                    <div className="relative w-[110%] -left-[5%] h-3 bg-gray-300 dark:bg-gray-700 rounded-b-xl -mt-1 shadow-md z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gray-400 dark:bg-gray-600 rounded-b"></div>
                    </div>
                    {/* Shadow/Feet */}
                    <div className="w-[114%] -left-[7%] relative h-1.5 bg-gray-200 dark:bg-gray-800 rounded-b-3xl mx-auto shadow-lg mt-0"></div>
                </div>
            )}
        </div>
    );
}
