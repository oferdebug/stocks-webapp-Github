import {searchStocks} from "@/lib/actions/finnhub.actions";
import {SearchCommand} from "@/components/SearchCommand";

export default async function SearchPage() {
    const initialStocks = await searchStocks('');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white">Search Stocks</h1>
                <p className="text-gray-400">Search for any stock by symbol or name to view detailed charts and
                    analysis.</p>
            </div>

            <div
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-white">Find your next investment</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Use our powerful search to explore thousands of stocks across global exchanges.
                    </p>
                </div>

                <SearchCommand
                    renderAs="button"
                    label="Open Search Console"
                    initialStocks={initialStocks}
                    className="h-12 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                />

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">K</kbd>
                    <span>to open anywhere</span>
                </div>
            </div>
        </div>
    );
}
