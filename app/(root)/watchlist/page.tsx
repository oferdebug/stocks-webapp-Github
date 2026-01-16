import React from 'react';
import {getWatchlist, getWatchlistSummary} from '@/lib/actions/watchlist.actions';
import {getAlerts} from '@/lib/actions/alert.actions';
import {WatchlistEmptyState} from '@/components/watchlist/WatchlistEmptyState';
import {AddStockButton} from '@/components/watchlist/AddStockButton';
import {WatchlistClient} from '@/components/watchlist/WatchlistClient';
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function WatchlistPage() {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) {
        redirect("/sign-in");
    }

    const [watchlist, stats, alerts] = await Promise.all([
        getWatchlist(),
        getWatchlistSummary(),
        getAlerts()
    ]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div
                className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">My Watchlist</h1>
                    <p className="text-gray-400">Track your favorite stocks and manage price alerts in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <AddStockButton/>
                </div>
            </div>

            {watchlist.length === 0 ? (
                <WatchlistEmptyState/>
            ) : (
                <WatchlistClient
                    initialWatchlist={watchlist}
                    initialStats={stats}
                    initialAlerts={alerts}
                />
            )}
        </div>
    );
}
