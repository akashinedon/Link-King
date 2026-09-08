import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'MiniLink profile';

interface Props {
    params: { username: string };
}

export default async function Image({ params }: Props) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        select: { name: true, username: true, bio: true, avatar: true },
    });

    const displayName = user?.name || (user?.username ? `@${user.username}` : 'MiniLink');
    const initial = (displayName[0] || 'M').toUpperCase();

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 32,
                    background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
                    fontFamily: 'sans-serif',
                }}
            >
                {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.avatar}
                        alt=""
                        width={180}
                        height={180}
                        style={{ borderRadius: '50%', border: '6px solid rgba(255,255,255,0.6)', objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        style={{
                            width: 180,
                            height: 180,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.2)',
                            border: '6px solid rgba(255,255,255,0.6)',
                            fontSize: 72,
                            color: 'white',
                            fontWeight: 700,
                        }}
                    >
                        {initial}
                    </div>
                )}

                <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, color: 'white' }}>
                    {displayName}
                </div>

                {user?.bio && (
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 28,
                            color: 'rgba(255,255,255,0.85)',
                            maxWidth: 800,
                            textAlign: 'center',
                        }}
                    >
                        {user.bio}
                    </div>
                )}

                <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>
                    minilink.app/{user?.username}
                </div>
            </div>
        ),
        { ...size }
    );
}
