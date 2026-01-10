import {Inngest} from 'inngest';

export const inngest = new Inngest({
    id: 'nexttrade',
    eventKey: process.env.INNGEST_EVENT_KEY || 'local-development',
    ai: {gemini: {apiKey: process.env.GEMINI_API_KEY!}},
    debug: process.env.NODE_ENV !== 'production'
});