import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toaster';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    );
}
