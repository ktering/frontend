import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/', '/legal/:path*', '/kterer', '/about-us'],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};