"use client"

import * as React from "react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {cn} from "@/lib/utils";
import {Loader2, TrendingUp, Search} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useEffect} from "react";
import {useDebounce} from "@/hooks/useDebounce";
import {StarButton} from "@/components/search/StarButton";

interface InlineSearchProps {
    initialStocks?: StockWithWatchlistStatus[]
    className?: string
}

/**
 * An inline search component for the Search page.
 * Displays a search input and a list of stocks (initial or search results).
 */
export function InlineSearch({
                                 initialStocks = [],
                                 className,
                             }: InlineSearchProps) {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [loading, setLoading] = React.useState(!initialStocks || initialStocks.length === 0)
    const [stocks, setStocks] = React.useState<StockWithWatchlistStatus[]>(initialStocks);
    const latestRequestIdRef = React.useRef(0);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : (stocks?.length > 0 ? stocks : initialStocks);

    const handleSearch = React.useCallback(async () => {
        const requestId = ++latestRequestIdRef.current;

        if (!searchTerm.trim()) {
            if (initialStocks && initialStocks.length > 0) {
                setStocks(initialStocks);
                setLoading(false);
                return;
            }

            // If no initial stocks, fetch popular stocks
            setLoading(true);
            try {
                const results = await searchStocks("");
                if (requestId === latestRequestIdRef.current) {
                    setStocks(results);
                }
            } catch (error) {
                console.error("Initial search failed:", error);
                if (requestId === latestRequestIdRef.current) {
                    setStocks([]);
                }
            } finally {
                if (requestId === latestRequestIdRef.current) {
                    setLoading(false);
                }
            }
            return;
        }

        setLoading(true);
        try {
            const results = await searchStocks(searchTerm.trim());
            if (requestId === latestRequestIdRef.current) {
                setStocks(results);
            }
        } catch (error) {
            console.error("Search failed:", error);
            if (requestId === latestRequestIdRef.current) {
                setStocks([]);
            }
        } finally {
            if (requestId === latestRequestIdRef.current) {
                setLoading(false);
            }
        }
    }, [searchTerm, initialStocks])

    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        if (!searchTerm.trim()) {
            handleSearch();
        } else {
            debouncedSearch();
        }
    }, [searchTerm, handleSearch, debouncedSearch]);

    return (
        <div className={cn("flex flex-col gap-6 w-full", className)}>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="h-5 w-5"/>
                </div>
                <input
                    type="text"
                    placeholder="Search stocks by symbol or name (e.g. TSLA, Microsoft)..."
                    aria-label="Search stocks by symbol or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg"
                />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-emerald-500 animate-spin"/>
                    </div>
                )}
            </div>

            <div className="bg-black/40 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/30 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        {isSearchMode ? "Search Results" : "Popular Stocks"}
                    </h2>
                    <span className="text-xs text-gray-500">
                        {displayStocks?.length || 0} stocks found
                    </span>
                </div>

                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    {displayStocks?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-gray-600"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-300">No stocks found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                {isSearchMode
                                    ? `We couldn't find any stocks matching "${searchTerm}". Try a different symbol or company name.`
                                    : "No popular stocks available at the moment."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800/50">
                            {displayStocks?.map((stock) => (
                                <div
                                    key={stock.symbol}
                                    className="group hover:bg-emerald-500/5 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <Link
                                            href={`/stocks/${stock.symbol}`}
                                            className="flex-1 flex items-center gap-4 min-w-0"
                                        >
                                            <div
                                                className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                                                <TrendingUp
                                                    className="h-6 w-6 text-gray-500 group-hover:text-emerald-500 transition-colors"/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span
                                                        className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                                                        {stock.symbol}
                                                    </span>
                                                    <span
                                                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-800 text-gray-500 border border-gray-700 font-mono uppercase tracking-tighter">
                                                        {stock.exchange}
                                                    </span>
                                                </div>
                                                <div
                                                    className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors font-medium">
                                                    {stock.name}
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:flex flex-col items-end">
                                                <span
                                                    className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Asset Type</span>
                                                <span className="text-sm text-gray-300">{stock.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StarButton
                                                    symbol={stock.symbol}
                                                    companyName={stock.name}
                                                    initialIsWatched={stock.isInWatchlist}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
