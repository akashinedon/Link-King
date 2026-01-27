import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'MiniLink - Your Link-in-Bio Platform',
    description: 'Create your personalized link-in-bio page in seconds. Share all your important links with one simple URL.',
    keywords: ['linktree', 'link in bio', 'social media', 'profile', 'links'],
    authors: [{ name: 'Tushar Bhardwaj' }],
    openGraph: {
        title: 'MiniLink - Your Link-in-Bio Platform',
        description: 'Create your personalized link-in-bio page in seconds.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MiniLink - Your Link-in-Bio Platform',
        description: 'Create your personalized link-in-bio page in seconds.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={`${inter.variable} font-sans`}>
                    <Providers>
                        {children}
                        <Toaster />
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    );
}
