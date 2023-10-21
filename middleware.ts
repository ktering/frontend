import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/', '/legal/:path*', '/kterer'],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};