import {inngest} from "@/inngest/client";
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
        console.log('>>> STARTING: sendSignUpEmail');

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("⛔ CRITICAL ERROR: GEMINI_API_KEY is missing from process.env!");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-flash-latest"});

        const userProfile = `
        - Country: ${event.data.country || 'Not specified'}
        - Investment Goals: ${event.data.investmentGoals || 'Growth'}
        - Risk Tolerance: ${event.data.riskTolerance || 'Medium'}
        - Preferred Industry: ${event.data.preferredIndustry || 'General'}
        `;

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        const introText = await step.run('generate-welcome-intro', async () => {
            try {
                console.log(">>> Requesting AI content (gemini-flash-latest)...");
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                console.log(">>> AI Success. Length:", text.length);
                return text;
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error("❌ AI Error in generate-welcome-intro:", errorMessage);
                // Log full error for debugging
                if (error && typeof error === 'object' && 'response' in error) {
                    console.error(">>> AI Error Response:", JSON.stringify((error as any).response, null, 2));
                }
                console.error(error);
                return "Thanks for joining NextTrade! We're excited to help you achieve your investment goals.";
            }
        });

        await step.run('send-welcome-email', async () => {
            const {data: {email, name}} = event;
            console.log(`>>> Sending welcome email to: ${email}`);
            try {
                const result = await sendWelcomeEmail({
                    email,
                    name: name || 'Investor',
                    intro: introText
                });
                console.log(`>>> sendWelcomeEmail result:`, result);
                return result;
            } catch (error) {
                console.error(`>>> FAILED to send welcome email to ${email}:`, error);
                throw error; // Re-throw to let Inngest retry if configured
            }
        });

        return {success: true};
    }
);


export const sendDailyNewsSummary = inngest.createFunction(
    {id: 'daily-news-summary'},
    [{event: 'app/send.daily.news'}, {cron: '0 12 * * *'}],
    async ({step}) => {
        console.log('>>> STARTING: sendDailyNewsSummary');

        // Step 1: Fetch all users for news email
        const users = await step.run('get-all-users', async () => {
            const allUsers = await getAllUsersForNewsEmail();
            console.log(`>>> getAllUsersForNewsEmail returned ${allUsers?.length || 0} users`);
            return allUsers;
        });

        if (!users || users.length === 0) {
            console.log('>>> No users found. Skipping email sending.');
            return {success: false, message: 'No Users Found For Daily News Summary Email'};
        }

        console.log(`>>> Found ${users.length} users`);

        // Step 2: Fetch news for each user
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ email: string, user: User, articles: MarketNewsArticle[] }> = [];
            for (const user of users) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    articles = (articles || []).slice(0, 7);

                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 7);
                    }
                    perUser.push({email: user.email, user, articles});
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    console.error('Error fetching news for user:', user.email, errorMessage);
                    perUser.push({email: user.email, user, articles: []});
                } finally {
                    console.log(">>> FINALLY block hit. User:", user.email)
                }
            }
            return perUser;
        });

        // Step 3: Generate AI summaries
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("⛔ CRITICAL ERROR: GEMINI_API_KEY is missing!");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-flash-latest"});


        const userNewsSummary: { user: User; newsContent: string }[] = [];

        for (const {user, articles} of results) {
            if (!articles || articles.length === 0) {
                console.log(`>>> No articles for user: ${user.email}. Skipping AI summary.`);
                userNewsSummary.push({
                    user,
                    newsContent: `<p class="mobile-text dark-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">No specific market news found for your watchlist today. Stay tuned for more updates!</p>`
                });
                continue;
            }

            const newsContent = await step.run(`summarize-news-${user.id}`, async () => {
                console.log(`>>> Articles for ${user.email}:`, articles.length);
                console.log(`>>> Articles data:`, JSON.stringify(articles, null, 2));

                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));
                    console.log(`>>> Prompt length:`, prompt.length);

                    console.log(`>>> Requesting AI content (gemini-flash-latest) for ${user.email}...`);
                    const result = await model.generateContent(prompt);
                    const text = result.response.text();
                    console.log(`>>> AI response length:`, text?.length);

                    return text || 'No Market News Found';
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    console.error('>>> AI FULL ERROR:', errorMessage);
                    if (error && typeof error === 'object' && 'response' in error) {
                        console.error(">>> AI Error Response:", JSON.stringify((error as any).response, null, 2));
                    }
                    return `<p style="color: #CCDADC;">Unable to generate a summary. Please check the platform for updates.</p>`;
                }
            });
            userNewsSummary.push({user, newsContent});
        }

        // Step 4: Send emails
        await step.run('send-news-emails', async () => {
            const today = getFormattedTodayDate();
            console.log(`>>> Sending ${userNewsSummary.length} news emails...`);

            for (const {user, newsContent} of userNewsSummary) {
                try {
                    const result = await sendDailyNewsEmail({email: user.email, date: today, newsContent});
                    console.log(`>>> News email sent to: ${user.email}`, result);
                } catch (error) {
                    console.error(`>>> FAILED to send news email to ${user.email}:`, error);
                }
            }
        });

        return {success: true, message: 'Daily News Summary Emails Sent Successfully!'};
    }
);