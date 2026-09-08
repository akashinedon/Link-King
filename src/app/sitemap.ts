import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';

// Render per-request instead of prerendering at build time - otherwise
// `next build` needs a live database connection just to produce the sitemap,
// and new profiles wouldn't show up until the next deploy.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl();

    const users = await prisma.user.findMany({
        where: { username: { not: null } },
        select: { username: true, updatedAt: true },
    });

    const profileEntries: MetadataRoute.Sitemap = users.map((user) => ({
        url: `${baseUrl}/${user.username}`,
        lastModified: user.updatedAt,
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        ...profileEntries,
    ];
}
