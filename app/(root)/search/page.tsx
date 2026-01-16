import {searchStocks} from "@/lib/actions/finnhub.actions";
import {InlineSearch} from "@/components/search/InlineSearch";

export default async function SearchPage() {
    const initialStocks = await searchStocks('');

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold text-white tracking-tight">Market Explorer</h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Search through thousands of stocks across global exchanges.
                    View real-time data, interactive charts, and advanced technical analysis.
                </p>
            </div>

            <InlineSearch initialStocks={initialStocks}/>
        </div>
    );
}
