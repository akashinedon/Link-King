import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes: [
        "/",
        "/sign-in(.*)",
        "/sign-up(.*)",
        "/login",
        "/register",
        "/icon",
        "/leaderboard",
        "/api/trpc/(.*)",
        "/api/track/(.*)",
        "/api/activity/(.*)",
        // Public bio-link profile pages, e.g. /someusername and
        // /someusername/opengraph-image - this MUST stay public, otherwise
        // anonymous visitors (i.e. everyone who isn't the profile owner)
        // get bounced to sign-in instead of seeing the profile.
        "/((?!dashboard|api|sign-in|sign-up|login|register|leaderboard|icon|_next).*)",
    ]
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
