import {inngest} from "@/inngest/client";
import {connectToDatabase} from "@/database/mongoose";
import User from "@/database/models/user.model";
import Watchlist from "@/database/models/watchlist.model";
import {getQuote} from "@/lib/actions/finnhub.actions";
import {sendWatchlistSummaryEmail} from "@/lib/nodemailer";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {getFormattedTodayDate} from "@/lib/utils";

const WATCHLIST_SUMMARY_AI_PROMPT = `
You are a financial analyst at NextTrade. 
Analyze the following stock performance from a user's watchlist and provide a brief, professional market summary (max 3 sentences).
Focus on overall trends and notable movements.
Data: {{data}}
`;

async function generateWatchlistAiSummary(data: any) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-flash-latest"});
        const prompt = WATCHLIST_SUMMARY_AI_PROMPT.replace('{{data}}', JSON.stringify(data));
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Summary generation failed:", error);
        return null;
    }
}

async function processWatchlistStockData(watchlist: any[]) {
    const stockData = await Promise.all(watchlist.map(async (item) => {
        const quote = await getQuote(item.symbol);
        return {
            symbol: item.symbol,
            companyName: item.companyName,
            price: quote?.c || 0,
            changePercent: quote?.dp || 0
        };
    }));

    const sortedByChange = [...stockData].sort((a, b) => b.changePercent - a.changePercent);
    const topGainer = sortedByChange[0];
    const topLoser = sortedByChange[sortedByChange.length - 1];

    return { stockData, topGainer, topLoser };
}

export const watchlistSummaryEmail = inngest.createFunction(
    {id: 'watchlist-daily-summary'},
    {cron: '0 8 * * *'}, // 8 AM Daily
    async ({step}) => {
        const users = await step.run('get-daily-users', async () => {
            await connectToDatabase();
            return User.find({'watchlistPreferences.emailFrequency': 'daily'});
        });

        if (!users || users.length === 0) return {message: "No users for daily summary"};

        for (const user of users) {
            await step.run(`process-user-${user._id}`, async () => {
                const watchlist = await Watchlist.find({userId: user.id || user._id.toString()});
                if (!watchlist || watchlist.length === 0) return;

                const { stockData, topGainer, topLoser } = await processWatchlistStockData(watchlist);

                let aiSummary = undefined;
                if (user.watchlistPreferences?.includeAiSummary) {
                    aiSummary = await generateWatchlistAiSummary(stockData);
                }

                const stocksTable = stockData.map(s => `
                    <tr style="border-bottom: 1px solid #30333A;">
                        <td style="padding: 10px 5px; color: #ffffff; font-weight: bold;">${s.symbol}</td>
                        <td style="padding: 10px 5px; color: #9ca3af;">${s.companyName}</td>
                        <td align="right" style="padding: 10px 5px; color: #ffffff;">$${s.price.toFixed(2)}</td>
                        <td align="right" style="padding: 10px 5px; color: ${s.changePercent >= 0 ? '#10b981' : '#ef4444'};">
                            ${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%
                        </td>
                    </tr>
                `).join('');

                await sendWatchlistSummaryEmail({
                    email: user.email,
                    name: user.name,
                    date: getFormattedTodayDate(),
                    totalStocks: stockData.length,
                    stocksTable,
                    topGainerSymbol: topGainer.symbol,
                    topGainerChange: topGainer.changePercent.toFixed(2),
                    topLoserSymbol: topLoser.symbol,
                    topLoserChange: topLoser.changePercent.toFixed(2),
                    aiSummary: aiSummary || undefined
                });
            });
        }
        return {count: users.length};
    }
);

export const watchlistWeeklySummary = inngest.createFunction(
    {id: 'watchlist-weekly-summary'},
    {cron: '0 8 * * 1'}, // 8 AM Monday
    async ({step}) => {
        const users = await step.run('get-weekly-users', async () => {
            await connectToDatabase();
            return User.find({'watchlistPreferences.emailFrequency': 'weekly'});
        });

        if (!users || users.length === 0) return {message: "No users for weekly summary"};

        for (const user of users) {
            await step.run(`process-user-${user._id}`, async () => {
                const watchlist = await Watchlist.find({userId: user.id || user._id.toString()});
                if (!watchlist || watchlist.length === 0) return;

                const { stockData, topGainer, topLoser } = await processWatchlistStockData(watchlist);

                let aiSummary = undefined;
                if (user.watchlistPreferences?.includeAiSummary) {
                    aiSummary = await generateWatchlistAiSummary(stockData);
                }

                const stocksTable = stockData.map(s => `
                    <tr style="border-bottom: 1px solid #30333A;">
                        <td style="padding: 10px 5px; color: #ffffff; font-weight: bold;">${s.symbol}</td>
                        <td style="padding: 10px 5px; color: #9ca3af;">${s.companyName}</td>
                        <td align="right" style="padding: 10px 5px; color: #ffffff;">$${s.price.toFixed(2)}</td>
                        <td align="right" style="padding: 10px 5px; color: ${s.changePercent >= 0 ? '#10b981' : '#ef4444'};">
                            ${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%
                        </td>
                    </tr>
                `).join('');

                await sendWatchlistSummaryEmail({
                    email: user.email,
                    name: user.name,
                    date: getFormattedTodayDate(),
                    totalStocks: stockData.length,
                    stocksTable,
                    topGainerSymbol: topGainer.symbol,
                    topGainerChange: topGainer.changePercent.toFixed(2),
                    topLoserSymbol: topLoser.symbol,
                    topLoserChange: topLoser.changePercent.toFixed(2),
                    aiSummary: aiSummary || undefined
                });
            });
        }
        return {count: users.length};
    }
);
