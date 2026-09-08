'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

interface QrCodeCardProps {
    url: string;
}

export default function QrCodeCard({ url }: QrCodeCardProps) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            setDataUrl(null);
            return;
        }

        let cancelled = false;

        QRCode.toDataURL(url, {
            width: 320,
            margin: 2,
            color: { dark: '#111827', light: '#ffffff' },
        })
            .then((generated) => {
                if (!cancelled) setDataUrl(generated);
            })
            .catch((error) => console.error('Failed to generate QR code:', error));

        return () => {
            cancelled = true;
        };
    }, [url]);

    const handleDownload = () => {
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'minilink-qr.png';
        link.click();
    };

    if (!url) return null;

    return (
        <div className="card p-6">
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Scan to open your profile - great for business cards, posters, or stories.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 dark:border-gray-700">
                    {dataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={dataUrl} alt="QR code linking to your profile" width={160} height={160} />
                    ) : (
                        <div className="w-[160px] h-[160px] animate-pulse bg-gray-100 rounded-lg" />
                    )}
                </div>

                <button
                    onClick={handleDownload}
                    disabled={!dataUrl}
                    className="btn-primary disabled:opacity-50"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                </button>
            </div>
        </div>
    );
}
