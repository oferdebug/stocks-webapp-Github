import {createAuthClient} from "better-auth/react";

// Senior Note: The authClient must be initialized for client-side usage
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL
});