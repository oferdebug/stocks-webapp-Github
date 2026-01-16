import React from 'react';
import {Loader2} from 'lucide-react';

export default function WatchlistLoading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin"/>
                <p className="text-gray-400 font-medium">Loading your watchlist...</p>
            </div>
        </div>
    );
}
