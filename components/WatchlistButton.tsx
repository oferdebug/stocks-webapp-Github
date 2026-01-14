"use client";

import React, {useState} from 'react';
import {Loader2, Star} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {authClient} from "@/lib/better-auth/client";
import {addToWatchlist, removeFromWatchlist} from "@/lib/actions/watchlist.actions";
import {toast} from "sonner";

interface WatchlistButtonProps {
    symbol: string;
    company?: string;
    isInWatchlist?: boolean;
}

export const WatchlistButton = ({
                                    symbol,
                                    company = "",
                                    isInWatchlist: initialIsInWatchlist = false,
                                }: WatchlistButtonProps) => {
    const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
    const [loading, setLoading] = useState(false);
    const {data: session} = authClient.useSession();

    const handleToggleWatchlist = async () => {
        if (!session?.user?.email) {
            toast.error("Please sign in to manage your watchlist");
            return;
        }

        setLoading(true);
        try {
            if (isInWatchlist) {
                const res = await removeFromWatchlist(symbol, session.user.email);
                if (res.success) {
                    setIsInWatchlist(false);
                    toast.success(`${symbol} removed from watchlist`);
                } else {
                    toast.error(res.error || "Failed to remove from watchlist");
                }
            } else {
                const res = await addToWatchlist(symbol, company || symbol, session.user.email);
                if (res.success) {
                    setIsInWatchlist(true);
                    toast.success(`${symbol} added to watchlist`);
                } else {
                    toast.error(res.error || "Failed to add to watchlist");
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className={cn(
                "flex items-center justify-center gap-2 w-full text-white h-11 text-base",
                isInWatchlist
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
            )}
            onClick={handleToggleWatchlist}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin"/>
            ) : (
                <Star className={cn("w-4 h-4", isInWatchlist && "fill-current")}/>
            )}
            {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>
    );
};
