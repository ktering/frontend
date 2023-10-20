import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/', '/delivery-policy', '/privacy-policy', '/terms-and-conditions', '/vendor-terms-and-conditions'],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};