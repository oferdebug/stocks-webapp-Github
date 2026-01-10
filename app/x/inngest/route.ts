import {serve} from "inngest/next";
import {inngest} from "@/inngest/client";
import {sendDailyNewsSummary, sendSignUpEmail} from "@/lib/inngest/functions";

// Proxy to the main Inngest endpoint to suppress 404s
export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [sendSignUpEmail, sendDailyNewsSummary],
})



