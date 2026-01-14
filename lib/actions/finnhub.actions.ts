'use server';

import {cache} from 'react';
import {formatArticle, validateArticle} from "@/lib/utils";
import {POPULAR_STOCK_SYMBOLS} from "@/lib/constants";

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
        console.log('>>> FINNHUB KEY:', NEXT_PUBLIC_FINNHUB_API_KEY?.substring(0, 10));

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

/**
 * Searches for stocks using Finnhub API.
 * If no query is provided, returns top 10 popular stocks.
 * If a query is provided, searches for matching stocks.
 */
export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
        let results: FinnhubSearchResult[] = [];

        if (!query || !query.trim()) {
            // Fetch top 10 popular symbols
            const topSymbols = POPULAR_STOCK_SYMBOLS.slice(0, 10);
            const profilePromises = topSymbols.map(async (symbol) => {
                try {
                    const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
                    const profile = await fetchJSON<{ name?: string; exchange?: string }>(url, 3600);
                    
                    return {
                        symbol: symbol,
                        description: profile.name || symbol,
                        displaySymbol: symbol,
                        type: 'Common Stock',
                        exchange: profile.exchange || 'US',
                    } as FinnhubSearchResult;
                } catch (err) {
                    // If profile fetch fails, return a basic result
                    return {
                        symbol: symbol,
                        description: symbol,
                        displaySymbol: symbol,
                        type: 'Common Stock',
                        exchange: 'US',
                    } as FinnhubSearchResult;
                }
            });

            results = await Promise.all(profilePromises);
        } else {
            // Search for stocks matching the query
            const trimmedQuery = query.trim();
            const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmedQuery)}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
            const searchResponse = await fetchJSON<FinnhubSearchResponse>(url, 1800);
            results = searchResponse.result || [];
        }

        // Map results to StockWithWatchlistStatus
        const mappedResults: StockWithWatchlistStatus[] = results
            .slice(0, 15) // Limit to 15 items
            .map((result) => ({
                symbol: result.symbol.toUpperCase(),
                name: result.description,
                exchange: result.displaySymbol || 'US',
                type: result.type || 'Stock',
                isInWatchlist: false,
            }));

        return mappedResults;
    } catch (error) {
        console.error('Error in stock search:', error);
        return [];
    }
});
