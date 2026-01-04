import {inngest} from "@/lib/inngest/client";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendDailyNewsSummaryEmail as sendDailyNewsEmail, sendWelcomeEmail} from "@/lib/nodemailer/";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";
import {getNews} from "@/lib/actions/finnhub.actions";
import {getFormattedTodayDate} from "@/lib/utils";

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


export const sendDailyNewsSummaryEmail = inngest.createFunction(
    {id: 'daily-news-summary-email'},
    [{event: 'app/send.daily.news'}, {cron: '0 12 * * *'}],
    async ({step}) => {
        console.log('>>> STARTING: sendDailyNewsSummary');

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("⛔ CRITICAL ERROR: GEMINI_API_KEY is missing from process.env!");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

        // Step 1: Get all users
        const users = await step.run('get-all-users', async () => {
            return await getAllUsersForNewsEmail();
        });

        if (!users || users.length === 0) {
            console.log(">>> No users found for daily news summary.");
            return {success: true, message: "No users found"};
        }

        // Step 2: Process each user
        for (const user of users) {
            await step.run(`process-news-for-user-${user.id}`, async () => {
                try {
                    // Get watchlist symbols for the user
                    const symbols = await getWatchlistSymbolsByEmail(user.email);

                    // Fetch news (watchlist or general fallback)
                    const news = await getNews(symbols);

                    if (!news || news.length === 0) {
                        console.log(`>>> No news articles found for user: ${user.email}`);
                        return;
                    }

                    // Step 3: Summarize news via AI
                    const newsDataString = JSON.stringify(news.map(n => ({
                        headline: n.headline,
                        summary: n.summary,
                        source: n.source,
                        url: n.url,
                        datetime: n.datetime
                    })));

                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', newsDataString);

                    console.log(`>>> Generating AI summary for user: ${user.email}`);
                    const result = await model.generateContent(prompt);
                    const newsContent = result.response.text();

                    // Step 4: Send the email
                    const todayDate = getFormattedTodayDate();

                    console.log(`>>> Sending daily news email to: ${user.email}`);
                    await sendDailyNewsEmail({
                        email: user.email,
                        newsContent,
                        date: todayDate
                    });
                } catch (error) {
                    console.error(`❌ Failed to process news for user ${user.email}:`, error);
                }
            });
        }

        return {success: true};
    }
);