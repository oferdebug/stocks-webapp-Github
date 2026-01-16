"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandInput,
    CommandList,
} from "@/components/ui/command"
import {Loader2, TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useDebounce} from "@/hooks/useDebounce";
import {StarButton} from "@/components/search/StarButton";

/**
 * Global search command that provides keyboard shortcut (Ctrl+K) access from anywhere.
 * This component doesn't render a visible trigger - it only handles the global keyboard shortcut.
 */
export function GlobalSearchCommand() {
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [stocks, setStocks] = React.useState<StockWithWatchlistStatus[]>([]);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 15);

    // Global keyboard shortcut listener
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Load initial stocks when dialog opens
    React.useEffect(() => {
        if (open && stocks.length === 0) {
            searchStocks('').then(results => {
                setStocks(results);
            }).catch(() => {
                setStocks([]);
            });
        }
    }, [open, stocks.length]);

    const handleSearch = async () => {
        if (!isSearchMode) {
            // Reset to initial stocks if search term is cleared
            if (stocks.length === 0) {
                setLoading(true);
                try {
                    const results = await searchStocks('');
                    setStocks(results);
                } catch {
                    setStocks([]);
                } finally {
                    setLoading(false);
                }
            }
            return;
        }

        setLoading(true);
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch {
            setStocks([]);
        } finally {
            setLoading(false);
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    React.useEffect(() => {
        debouncedSearch();
    }, [searchTerm, debouncedSearch]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
    }

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            className="search-dialog">
            <div className="search-field">
                <CommandInput
                    placeholder="Type a symbol or name..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="search-input"
                />
                {loading && <Loader2 className="search-loader"/>}
            </div>
            <CommandList className="search-list">
                {loading ? (
                    <div className="search-list-indicator">
                        Loading Stocks...
                    </div>
                ) : displayStocks?.length === 0 ? (
                    <div className="search-list-indicator">
                        {isSearchMode ? "No Results Found" : "No Stocks Available"}
                    </div>
                ) : (
                    <ul>
                        <div className="search-count">
                            {isSearchMode ? "Search Results" : "Popular Stocks"}
                            ({displayStocks?.length || 0})
                        </div>
                        {displayStocks?.map((stock) => (
                            <li key={stock.symbol} className="search-item">
                                <Link
                                    href={`/stocks/${stock.symbol}`}
                                    onClick={handleSelectStock}
                                    className="search-item-link">
                                    <TrendingUp className="h-4 w-4 text-gray-600"/>
                                    <div className="flex-1">
                                        <div className="search-item-name">{stock.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {stock.symbol}|{stock.exchange}|{stock.type}
                                        </div>
                                    </div>
                                    <StarButton
                                        symbol={stock.symbol}
                                        companyName={stock.name}
                                        initialIsWatched={stock.isInWatchlist}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CommandList>
        </CommandDialog>
    );
}
