'use client';

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
    Link2
} from 'lucide-react';
import Image from 'next/image';
import LinkButton from '@/components/link-button';

const iconMap: Record<string, any> = {
    website: Globe,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    facebook: Facebook,
    email: Mail,
    whatsapp: MessageCircle,
    telegram: Send,
    spotify: Music2,
    twitch: Twitch,
    kofi: Coffee,
    shop: ShoppingBag,
    link: Link2,
};

interface Props {
    links: any[];
}

export default function ProfileLinks({ links }: Props) {
    return (
        <div className="space-y-3">
            {links.map((link, index) => {
                const IconComponent = link.icon ? iconMap[link.icon] : Link2;
                const isCustomIcon = link.icon?.startsWith('http');

                return (
                    <div
                        key={link.id}
                        className="opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <LinkButton
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
                    </div>
                );
            })}
        </div>
    );
}
