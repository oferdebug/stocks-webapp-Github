"use client"

import * as React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {cn} from "@/lib/utils";
import {Loader2, Star, TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useEffect} from "react";
import {useDebounce} from "@/hooks/useDebounce";
import {StarButton} from "@/components/search/StarButton";

interface SearchCommandProps {
    renderAs?: 'button' | 'text'
    label?: React.ReactNode
    initialStocks?: StockWithWatchlistStatus[]
    className?: string
}

/**
 * Render a searchable command-style dialog for finding and selecting stocks.
 *
 * Presents a trigger (button or text), an input with debounced search against `searchStocks`, and a list of results or popular stocks. Selecting a result navigates to the stock page and closes the dialog.
 *
 * @param renderAs - Either `'text'` to render the trigger as inline text or `'button'` to render it as a button element.
 * @param label - The label displayed on the trigger.
 * @param initialStocks - Initial list of stocks to show when no search term is entered; each item may include watchlist status.
 * @param className - Optional additional CSS classes applied to the trigger element.
 * @returns A React element rendering the search trigger and the command dialog UI for stock lookup and selection.
 */
export function SearchCommand({
                                  renderAs = 'button',
                                  label = 'Search Stocks',
                                  initialStocks = [],
                                  className,
                              }: SearchCommandProps) {
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [stocks, setStocks] = React.useState<StockWithWatchlistStatus[]>(initialStocks);

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 15);

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

    const handleSearch = async () => {
        if (!isSearchMode) return setStocks(initialStocks);

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

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm, debouncedSearch]);


    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
        setStocks(initialStocks);
    }

    return (
        <>
            {renderAs === "text" ? (
                <span
                    onClick={() => setOpen(true)}
                    className={cn("search-text", className)}>
            {label}
          </span>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className={cn("search-btn", className)}>
                    {label}
                </button>
            )}

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
                        <CommandEmpty className="search-list-empty">
                            Loading Stocks...
                        </CommandEmpty>
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
                            {displayStocks?.map((stock, i) => (
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
        </>
    );
}