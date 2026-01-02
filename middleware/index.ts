import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getSessionCookie} from "better-auth/cookies";

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