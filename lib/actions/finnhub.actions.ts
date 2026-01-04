'use server';

import {formatArticle, validateArticle} from "@/lib/utils";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

/**
 * Generic fetch function for Finnhub API with Next.js caching support.
 */
async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
    const fetchOptions: RequestInit = revalidateSeconds !== undefined
        ? {next: {revalidate: revalidateSeconds}, cache: 'force-cache'}
        : {cache: 'no-store'};

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetches news for specified symbols or general market news.
 */
export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
    try {
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(toDate.getDate() - 5);

        const to = toDate.toISOString().split('T')[0];
        const from = fromDate.toISOString().split('T')[0];

        if (symbols && symbols.length > 0) {
            const cleanSymbols = symbols.map(s => s.trim().toUpperCase());
            const collectedArticles: MarketNewsArticle[] = [];
            const seenUrls = new Set<string>();

            // Loop max 6 times, round-robin through symbols
            for (let i = 0; i < 6; i++) {
                const symbol = cleanSymbols[i % cleanSymbols.length];
                const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;

                try {
                    const articles = await fetchJSON<RawNewsArticle[]>(url, 3600); // Cache for 1 hour

                    // Take one valid, new article per round
                    const validArticle = articles.find(a =>
                        validateArticle(a) && a.url && !seenUrls.has(a.url)
                    );

                    if (validArticle && validArticle.url) {
                        seenUrls.add(validArticle.url);
                        collectedArticles.push(formatArticle(validArticle, true, symbol, i));
                    }
                } catch (err) {
                    console.error(`Error fetching news for ${symbol}:`, err);
                }

                if (collectedArticles.length >= 6) break;
            }

            return collectedArticles.sort((a, b) => b.datetime - a.datetime);
        } else {
            // Fetch general market news
            const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
            const articles = await fetchJSON<RawNewsArticle[]>(url, 3600);

            const uniqueArticles: MarketNewsArticle[] = [];
            const seenIds = new Set<number>();
            const seenUrls = new Set<string>();
            const seenHeadlines = new Set<string>();

            for (const article of articles) {
                if (uniqueArticles.length >= 6) break;

                if (validateArticle(article) && article.id && article.url && article.headline) {
                    if (!seenIds.has(article.id) && !seenUrls.has(article.url) && !seenHeadlines.has(article.headline)) {
                        seenIds.add(article.id);
                        seenUrls.add(article.url);
                        seenHeadlines.add(article.headline);
                        uniqueArticles.push(formatArticle(article, false, undefined, uniqueArticles.length));
                    }
                }
            }

            return uniqueArticles;
        }
    } catch (error) {
        console.error("Error in getNews:", error);
        throw new Error("Failed to fetch news");
    }
}
