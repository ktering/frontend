import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/legal/:path*",
    "/become-a-kterer",
    "/about-us",
    "/api/:path*",
    "/help",
  ],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const homePage = new URL("/", req.url);
      return NextResponse.redirect(homePage);
    }
    // @ts-ignore
    const checkUser = (auth.sessionClaims?.ktererSignUpCompleted as any)
      ?.ktererSignUpCompleted;

    // let checkUser: boolean | undefined = undefined;
    // if (auth.sessionClaims && 'ktererSignUpCompleted' in auth.sessionClaims) {
    //     const sessionClaims = (auth.sessionClaims as unknown) as {
    //         ktererSignUpCompleted: { ktererSignUpCompleted: boolean }
    //     };
    //     checkUser = sessionClaims.ktererSignUpCompleted.ktererSignUpCompleted;
    // }

    // TODO: Add check for non-kterer users so they can't access the kterer pages
    if (auth.userId) {
      if (req.nextUrl.pathname === "/") {
        if (checkUser === true) {
          const dashboardPage = new URL("/kterer/dashboard", req.url);
          return NextResponse.redirect(dashboardPage);
        } else {
          const signedInUserPage = new URL("/kterings", req.url);
          return NextResponse.redirect(signedInUserPage);
        }
      }

      if (
        !checkUser &&
        (req.nextUrl.pathname === "/kterer-onboarding/kyc-verified" ||
          // @ts-ignore
          req.nextUrl.pathname === "/kterer/dashboard")
      ) {
        const setupPage = new URL("/kterer-onboarding/kterer-setup", req.url);
        return NextResponse.redirect(setupPage);
      } else if (
        checkUser === true &&
        req.nextUrl.pathname === "/kterer-onboarding/kterer-setup"
      ) {
        const dashboardPage = new URL("/kterer/dashboard", req.url);
        return NextResponse.redirect(dashboardPage);
      }

      if (
        req.nextUrl.pathname.startsWith("/kterer") &&
        req.nextUrl.pathname !== "/kterer-onboarding/kyc-verified" &&
        req.nextUrl.pathname !== "/kterer-onboarding/kterer-setup" &&
        !checkUser
      ) {
        const signedInUserPage = new URL("/kterings", req.url);
        return NextResponse.redirect(signedInUserPage);
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
