import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/api', '/sign-in', '/sign-up'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
