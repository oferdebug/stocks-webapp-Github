import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getSessionCookie} from "better-auth/cookies";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Handle Inngest discovery paths to suppress 404s
    if (pathname === '/.netlify/functions/inngest' || pathname === '/.redwood/functions/inngest') {
        return NextResponse.rewrite(new URL('/api/inngest', request.url));
    }

    // Retrieve the session cookie to verify if the user is authenticated
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|next/image|favicon.ico|sign-in|sign-up|assets).*)',
        '/.netlify/functions/inngest',
        '/.redwood/functions/inngest'
    ], //Specify the paths the middleware applies to
};