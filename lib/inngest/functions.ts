import {inngest} from "@/lib/inngest/client";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendDailyNewsEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {connectToDatabase} from "@/database/mongoose";

export const sendSignUpEmail=inngest.createFunction(
    {id:'sign-up-email'},
    {event: 'app/user.created'},
    async ({event, step}) => {
        console.log('Inngest function triggered for event:', event.name);
        const userProfile = `
        - Country: ${event.data.country}
        - Investment Goals: ${event.data.investmentGoals}
        - Risk Tolerance: ${event.data.riskTolerance}
        - Preferred Industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        console.log('Generating welcome intro using AI...');
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({model: 'gemini-1.5-pro'}),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {text: prompt}
                        ]
                    }
                ]
            }
        });

        await step.run('send-welcome-email', async () => {
            console.log('AI response received, preparing email...');
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) || 'Thanks For Joining NextTrade!. You Now Gain Access To The Full Power Of oUR App,Start Investment Smarter Using Our Tools!'

            const {data:{email,name}}=event;

            console.log(`Sending welcome email to: ${email}`);
            try {
                const result = await sendWelcomeEmail({email, name, intro: introText});
                console.log('Email sent successfully');
                return result;
            } catch (error) {
                console.error('Failed to send email:', error);
                throw error;
            }
        })

        return {success: true, massage: 'Welcome email Sending Process completed Successfully'};
    }
)

export const sendDailyMarketNews = inngest.createFunction(
    {id: 'daily-market-news'},
    {cron: '0 9 * * *'}, // 9 AM daily
    async ({step}) => {
        const users = await step.run('fetch-users', async () => {
            const mongoose = await connectToDatabase();
            const db = mongoose.connection.db;
            if (!db) throw new Error('Database connection failed');
            // Fetch all users from the users collection (Better Auth default)
            return await db.collection('user').find({}, {projection: {email: 1}}).toArray();
        });

        if (users.length === 0) return {message: 'No users found'};

        // For simplicity in this demo, we generate one general news summary and send to all.
        // In a real app, you might want personalized news based on their preferences.
        const newsSummary = await step.run('generate-market-news', async () => {
            // In a real app, you'd fetch real market news here first.
            // For now, we'll use a placeholder news data.
            const placeholderNews = "NVIDIA (NVDA) hits new all-time high as AI demand surges. Federal Reserve signals potential rate cuts in late 2025. Bitcoin (BTC) stabilizes above $90,000.";

            const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', placeholderNews);

            const response = await step.ai.infer('generate-daily-news', {
                model: step.ai.models.gemini({model: 'gemini-1.5-pro'}),
                body: {
                    contents: [{role: 'user', parts: [{text: prompt}]}]
                }
            });

            const part = response.candidates?.[0]?.content?.parts?.[0];
            return (part && 'text' in part ? part.text : null) || 'Market is looking positive today! Check your dashboard for latest updates.';
        });

        for (const user of users) {
            await step.run('send-news-email', async () => {
                await sendDailyNewsEmail({email: user.email, newsContent: newsSummary});
            });
        }

        return {success: true, message: `Daily news sent to ${users.length} users`};
    }
)