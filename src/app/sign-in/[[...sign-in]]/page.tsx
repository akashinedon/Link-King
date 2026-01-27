import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <SignIn />
        </div>
    );
}
