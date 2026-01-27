import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import PromoFooter from '@/components/public-profile/promo-footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-md w-full text-center">

                {/* 404 Text */}
                <h1 className="text-[8rem] font-bold leading-none bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent opacity-80 select-none">
                    404
                </h1>

                <h2 className="text-2xl font-bold mb-4">
                    Page not found
                </h2>

                <p className="text-gray-400 mb-8">
                    The link you are looking for doesn&apos;t exist or has been moved.
                    But hey, that&apos;s a great opportunity!
                </p>

                {/* Cards */}
                <div className="space-y-4 mb-12">
                    <Link
                        href="/"
                        className="block group"
                    >
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-white group-hover:text-primary-300 transition-colors">
                                    Claim this MiniLink
                                </p>
                                <p className="text-xs text-gray-400">
                                    Create your own page in seconds
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-8 w-full">
                <PromoFooter />
            </div>
        </div>
    );
}
