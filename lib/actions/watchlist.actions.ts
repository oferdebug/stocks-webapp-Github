'use server';

import {connectToDatabase} from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";

/**
 * Retrieves the watchlist symbols for a user based on their email.
 */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) {
            console.error("Database connection not established");
            return [];
        }

        // Find the user by email in the 'user' collection (Better Auth)
        const user = await db.collection('user').findOne({email});

        if (!user) {
            return [];
        }

        // Query the Watchlist by userId
        // Note: Better Auth usually uses 'id' or '_id'. 
        // Based on lib/actions/user.actions.ts, it uses user.id || user._id
        const userId = user.id || user._id.toString();

        const watchlistItems = await Watchlist.find({userId});

        return watchlistItems.map(item => item.symbol);
    } catch (error) {
        console.error("Error in getWatchlistSymbolsByEmail:", error);
        return [];
    }
}


export async function addToWatchlist(
  symbol: string,
  company: string,
  email: string
) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database connection not established");
      return false;
    }

    // Find the user by email in the 'user' collection (Better Auth)
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      console.error("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error in addToWatchlist:", error);
    return false;
  }
}
