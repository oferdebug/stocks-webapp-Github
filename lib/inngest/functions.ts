import {inngest} from "@/lib/inngest/client";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT, NEWS_SUMMARY_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendDailyNewsEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {connectToDatabase} from "@/database/mongoose";
import {GoogleGenerativeAI} from "@google/generative-ai";

export const sendSignUpEmail = inngest.createFunction(
    {id: 'sign-up-email'},
    {event: 'app/user.created'},
    async ({event, step}) => {
        console.log('>>> STARTING: sendSignUpEmail (Using Adrian\'s Prompts)');

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("⛔ CRITICAL ERROR: GEMINI_API_KEY is missing from process.env!");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        const userProfile = `
        - Country: ${event.data.country || 'Not specified'}
        - Investment Goals: ${event.data.investmentGoals || 'Growth'}
        - Risk Tolerance: ${event.data.riskTolerance || 'Medium'}
        - Preferred Industry: ${event.data.preferredIndustry || 'General'}
        `;

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        const introText = await step.run('generate-welcome-intro', async () => {
            try {
                console.log(">>> Requesting AI content (gemini-2.0-flash)...");
                const result = await model.generateContent(prompt);
                const text = result.response.text();

                console.log(">>> AI Success. Length:", text.length);
                return text;
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error("❌ AI Error:", errorMessage);
                return "Thanks for joining NextTrade! We're excited to help you achieve your investment goals.";
            }
        });

        await step.run('send-welcome-email', async () => {
            const {data: {email, name}} = event;
            return await sendWelcomeEmail({
                email,
                name: name || 'Investor',
                intro: introText
            });
        });

        return {success: true};
    }
);

export const sendDailyMarketNews = inngest.createFunction(
    {id: 'daily-market-news'},
    {cron: '0 9 * * *'},
    async ({step}) => {
        const users = await step.run('fetch-users', async () => {
            const mongoose = await connectToDatabase();
            const db = mongoose.connection.db;
            if (!db) throw new Error('Database connection failed');
            return await db.collection('user').find({}, {projection: {email: 1}}).toArray();
        });

        if (users.length === 0) return {message: 'No users found'};

        const newsSummary = await step.run('generate-market-news', async () => {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) return "Market updates unavailable.";

            const placeholderNews = `
            1. NVIDIA (NVDA) - Stock surged 8% to $950, hitting all-time high after announcing new AI chip partnership with Microsoft. Trading volume 3x normal.

            2. Bitcoin (BTC) - Stabilized at $95,000 after volatile week. Institutional buying increased 25% according to Coinbase data.

            3. Federal Reserve - Chair Powell signals potential rate cuts in Q2 2026, citing cooling inflation at 2.3%. Markets rallied on the news.

            4. Tesla (TSLA) - Dropped 3% after Q4 delivery numbers missed expectations by 5%. Analysts maintain buy ratings citing long-term EV growth.

            5. Apple (AAPL) - Announced $100B stock buyback program. Shares up 2% in after-hours trading.
`;
            const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', placeholderNews);

            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({model: "gemini-pro"});

                const result = await model.generateContent(prompt);
                return result.response.text();
            } catch (error) {
                console.error('Gemini News Error:', error);
                return 'Market is looking positive today! Check your dashboard for latest updates.';
            }
        });

        for (const user of users) {
            await step.run(`send-news-email-${user.email}`, async () => {
                await sendDailyNewsEmail({
                    email: user.email,
                    newsContent: newsSummary,
                    date: new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                });
            });
        }
        return {success: true, message: `Sent to ${users.length} users`};
    }
);