import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function generateUsername(email: string): string {
    const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const random = Math.random().toString(36).substring(2, 6);
    return `${base}${random}`;
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function ensureHttps(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }
    return url;
}

export function getBaseUrl(): string {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
