"use client";

import React, {useEffect, useState} from 'react';
import {Star} from 'lucide-react';
import {cn} from '@/lib/utils';
import {isInWatchlist, toggleWatchlist} from '@/lib/actions/watchlist.actions';
import {toast} from 'sonner';
import {authClient} from "@/lib/better-auth/client";

interface StarButtonProps {
    symbol: string;
    companyName: string;
    initialIsWatched?: boolean;
}

export const StarButton = ({symbol, companyName, initialIsWatched}: StarButtonProps) => {
    const [isWatched, setIsWatched] = useState(initialIsWatched);
    const {data: session} = authClient.useSession();

    useEffect(() => {
        if (initialIsWatched === undefined && session) {
            const checkWatchlist = async () => {
                const watched = await isInWatchlist(symbol);
                setIsWatched(watched);
            };
            checkWatchlist();
        } else if (initialIsWatched !== undefined) {
            setIsWatched(initialIsWatched);
        }
    }, [symbol, initialIsWatched, session]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const nextState = !isWatched;
        setIsWatched(nextState);

        try {
            const res = await toggleWatchlist(symbol, companyName);
            if (!res.success) {
                setIsWatched(!nextState);
                toast.error(res.error || "Please sign in to manage your watchlist");
            } else {
                toast.success(nextState ? `Added ${symbol} to watchlist` : `Removed ${symbol} from watchlist`);
            }
        } catch (error) {
            setIsWatched(!nextState);
            toast.error("An error occurred while updating watchlist");
        }
    };

    return (
        <div
            onClick={handleToggle}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
        >
            <Star
                className={cn(
                    "h-5 w-5 transition-colors",
                    isWatched ? "fill-yellow-500 text-yellow-500" : "text-gray-500 hover:text-yellow-500"
                )}
            />
        </div>
    );
};
