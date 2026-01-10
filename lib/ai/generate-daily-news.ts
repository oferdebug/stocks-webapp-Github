import {GoogleGenerativeAI} from '@google/generative-ai';
import {getFormattedTodayDate} from '@/lib/utils';

const MODEL_NAME = 'gemini-2.0-flash'; // Using gemini-2.0-flash as requested

export interface DailyNews {
    date: string;
    newsContent: string;
}

/**
 * Generates daily market news content using Gemini AI with Google Search Grounding
 * Searches for current market data, top movers, sector performance, and key headlines
 */
export async function generateDailyNews(): Promise<DailyNews> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing from environment variables');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Configure model with Google Search Grounding tool
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            tools: [{
                googleSearchRetrieval: {}
            }]
        });

        // Comprehensive prompt for market news generation
        const prompt = `You are a financial analyst creating a daily market summary email for NextTrade, a stock trading platform. 

Your task is to search for and compile the most current market information from the last 24 hours and generate a comprehensive HTML-formatted market report.

REQUIRED SECTIONS (in this order):

1. MARKET OVERVIEW
   - Current values and percentage changes for:
     * S&P 500 (SPX)
     * NASDAQ Composite (IXIC)
     * Dow Jones Industrial Average (DJI)
     * VIX (Volatility Index)
   - Brief 1-2-sentence summary of overall market sentiment

2. TOP GAINERS (3-5 stocks)
   - Stock ticker symbol
   - Company name
   - Current price and percentage gain
   - Primary reason for the gain (earnings, news, sector trends, etc.)

3. TOP LOSERS (3-5 stocks)
   - Stock ticker symbol
   - Company name
   - Current price and percentage loss
   - Primary reason for the decline (earnings, news, sector trends, etc.)

4. SECTOR PERFORMANCE
   - Top 3-5 performing sectors with percentage changes
   - Bottom 3-5 performing sectors with percentage changes
   - Brief explanation of sector trends

5. KEY MARKET HEADLINES (from last 24 hours)
   - 3-5 most important market news stories
   - Include headline, brief summary (2-3 sentences), and why it matters

CRITICAL HTML FORMATTING REQUIREMENTS:

You MUST return ONLY clean HTML content (no markdown, no code blocks, no backticks) with these exact inline styles:

SECTION HEADERS:
<h2 style="margin: 25px 0 15px 0; font-size: 18px; font-weight: 600; color: #34d399; border-bottom: 1px solid #30333A; padding-bottom: 8px;">Section Title</h2>

PARAGRAPHS:
<p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.7; color: #CCDADC;">Content goes here</p>

POSITIVE NUMBERS/GAINS:
<span style="color: #10b981; font-weight: 600;">+X.XX%</span>

NEGATIVE NUMBERS/LOSSES:
<span style="color: #ef4444; font-weight: 600;">-X.XX%</span>

STOCK TICKERS:
<span style="font-weight: 600; color: #ffffff;">AAPL</span>

COMPANY NAMES:
<span style="font-weight: 500; color: #CCDADC;">Apple Inc.</span>

CONTENT GUIDELINES:
- Use plain English that regular investors can understand
- Be concise but informative
- Focus on actionable insights
- Ensure all data is current (from the last 24 hours)
- Format all percentages to 2 decimal places (e.g., +2.45%, -1.23%)
- Format prices to 2 decimal places (e.g., $150.25)
- Make the content scannable with clear sections

TONE:
- Professional but accessible
- Confident but not overly bullish or bearish
- Focus on facts and data-driven insights

Now generate the complete HTML-formatted market summary using the Google Search tool to find the most current market data.`;

        console.log('>>> Generating daily market news with Gemini AI (Google Search Grounding enabled)...');

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response - remove any markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```html')) {
            cleanedText = cleanedText.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/```\n?/g, '');
        }

        console.log('>>> Successfully generated daily news. Content length:', cleanedText.length);

        return {
            date: getFormattedTodayDate(),
            newsContent: cleanedText
        };
    } catch (error) {
        // Return fallback content instead of throwing
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        if (errorMessage.includes("API key was reported as leaked")) {
            console.error("⛔ SECURITY ALERT: GEMINI_API_KEY has been leaked and disabled by Google. Please rotate your API key immediately!");
        } else {
            console.error('❌ Error generating daily news:', error);
        }

        return {
            date: getFormattedTodayDate(),
            newsContent: `
        <h2 style="margin: 25px 0 15px 0; font-size: 18px; font-weight: 600; color: #34d399; border-bottom: 1px solid #30333A; padding-bottom: 8px;">Market Update</h2>
        <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.7; color: #CCDADC;">
          We encountered an issue generating today's market summary. Please check back later or visit our platform for the latest market updates.
        </p>
        <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">
          Error: ${errorMessage.includes("leaked") ? "Service temporarily unavailable due to security maintenance." : errorMessage}
        </p>
      `
        };
    }
}
