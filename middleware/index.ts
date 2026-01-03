import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getSessionCookie} from "better-auth/cookies";

/**
 * Enforces session-based authentication for incoming requests.
 *
 * @param request - The incoming Next.js request to inspect for a session cookie.
 * @returns A NextResponse that redirects to `'/'` when no session cookie is present, or proceeds with the request otherwise.
 */
export function middleware(request: NextRequest) {
    // Retrieve the session cookie to verify if the user is authenticated
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|next/image|favicon.ico|sign-in|sign-up|assets).*)'], //Specify the paths the middleware applies to
};