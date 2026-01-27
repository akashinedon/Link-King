import { redirect } from 'next/navigation';
import { currentUser } from "@clerk/nextjs";
import DashboardNav from '@/components/dashboard/dashboard-nav';
import { SiteFooter } from '@/components/site-footer';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <DashboardNav
                user={{
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.emailAddresses[0]?.emailAddress,
                    username: user.username,
                    image: user.imageUrl,
                }}
            />
            <main className="pt-16 flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
