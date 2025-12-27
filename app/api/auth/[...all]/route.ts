import { auth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

{/* Senior Note: This is the dynamic route handler that Better-Auth requires to process requests */}
const handler = toNextJsHandler(auth);

export const { GET, POST } = handler;
export const dynamic = "force-dynamic";