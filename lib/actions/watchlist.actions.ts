'use server';

import {connectToDatabase} from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";
import {getQuote, getCompanyProfile} from "./finnhub.actions";
import {cache} from "react";

/**
 * Add a stock to the user's watchlist.
 */
export async function addToWatchlist(symbol: string, companyName: string, email?: string) {
    try {
        await connectToDatabase();
        let targetUserId: string | undefined;

        if (email) {
            const mongoose = await connectToDatabase();
            const db = mongoose.connection.db;
            const user = await db?.collection("user").findOne({email});
            targetUserId = user?.id || user?._id?.toString();
        } else {
            const session = await auth.api.getSession({headers: await headers()});
            targetUserId = session?.user?.id;
        }

        if (!targetUserId) return {success: false, error: "User not found or unauthorized"};

        await Watchlist.create({
            userId: targetUserId,
            symbol: symbol.toUpperCase(),
            companyName
        });

        revalidatePath("/watchlist");
        revalidatePath("/search");
        return {success: true};
    } catch (error: any) {
        if (error.code === 11000) {
            return {success: true, message: "Already in watchlist"};
        }
        console.error("Error in addToWatchlist:", error);
        return {success: false, error: "Failed to add to watchlist"};
    }
}

/**
 * Remove a stock from the watchlist.
 */
export async function removeFromWatchlist(symbol: string, email?: string) {
    try {
        await connectToDatabase();
        let targetUserId: string | undefined;

        if (email) {
            const mongoose = await connectToDatabase();
            const db = mongoose.connection.db;
            const user = await db?.collection("user").findOne({email});
            targetUserId = user?.id || user?._id?.toString();
        } else {
            const session = await auth.api.getSession({headers: await headers()});
            targetUserId = session?.user?.id;
        }

        if (!targetUserId) return {success: false, error: "User not found or unauthorized"};

        await Watchlist.deleteOne({
            userId: targetUserId,
            symbol: symbol.toUpperCase()
        });

        revalidatePath("/watchlist");
        revalidatePath("/search");
        return {success: true};
    } catch (error) {
        console.error("Error in removeFromWatchlist:", error);
        return {success: false, error: "Failed to remove from watchlist"};
    }
}

/**
 * Get user's watchlist enriched with live Finnhub data.
 */
export const getWatchlist = cache(async () => {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return [];

        await connectToDatabase();
        const items = await Watchlist.find({userId: session.user.id}).sort({addedAt: -1});

        const enrichedItems = await Promise.all(items.map(async (item) => {
            const [quote, profile] = await Promise.all([
                getQuote(item.symbol),
                getCompanyProfile(item.symbol)
            ]);

            return {
                id: item._id.toString(),
                symbol: item.symbol,
                companyName: item.companyName,
                addedAt: item.addedAt,
                currentPrice: quote?.c,
                change: quote?.d,
                changePercent: quote?.dp,
                marketCap: profile?.marketCapitalization,
                logo: profile?.logo
            };
        }));

        return enrichedItems;
    } catch (error) {
        console.error("Error in getWatchlist:", error);
        return [];
    }
});

/**
 * Check if a stock is in the user's watchlist.
 */
export async function isInWatchlist(symbol: string) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return false;

        await connectToDatabase();
        const item = await Watchlist.findOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase()
        });

        return !!item;
    } catch (error) {
        return false;
    }
}

/**
 * Toggle add/remove from watchlist.
 */
export async function toggleWatchlist(symbol: string, companyName: string) {
    try {
        const isWatched = await isInWatchlist(symbol);
        if (isWatched) {
            return await removeFromWatchlist(symbol);
        } else {
            return await addToWatchlist(symbol, companyName);
        }
    } catch (error) {
        console.error("Error in toggleWatchlist:", error);
        return {success: false, error: "Failed to toggle watchlist"};
    }
}

/**
 * Get watchlist summary statistics.
 */
export const getWatchlistSummary = cache(async () => {
    try {
        const watchlist = await getWatchlist();
        if (!watchlist || watchlist.length === 0) {
            return {
                totalStocks: 0,
                gainersCount: 0,
                losersCount: 0,
                topGainer: null,
                topLoser: null
            };
        }

        const gainers = watchlist.filter(s => (s.changePercent || 0) > 0);
        const losers = watchlist.filter(s => (s.changePercent || 0) < 0);

        const sortedByChange = [...watchlist].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));

        return {
            totalStocks: watchlist.length,
            gainersCount: gainers.length,
            losersCount: losers.length,
            topGainer: sortedByChange[0],
            topLoser: sortedByChange[sortedByChange.length - 1]
        };
    } catch (error) {
        console.error("Error in getWatchlistSummary:", error);
        return null;
    }
});

/**
 * Internal: Retrieve watchlist symbols by email.
 */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) return [];

        const user = await db.collection('user').findOne({email});
        if (!user) return [];

        const userId = user.id || user._id.toString();
        const watchlistItems = await Watchlist.find({userId});

        return watchlistItems.map(item => item.symbol);
    } catch (error) {
        console.error("Error in getWatchlistSymbolsByEmail:", error);
        return [];
    }
}

/**
 * Internal: Check if stock is in watchlist by email.
 */
export async function isStockInWatchlist(symbol: string, email: string): Promise<boolean> {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) return false;
        const user = await db.collection("user").findOne({email});
        if (!user) return false;
        const userId = user.id || user._id.toString();
        const item = await Watchlist.findOne({userId, symbol: symbol.toUpperCase()});
        return !!item;
    } catch (error) {
        return false;
    }
}