import TradingViewWidget from "@/components/TradingViewWidget";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG
} from "@/lib/constants";
import {WatchlistButton} from "@/components/WatchlistButton";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {isStockInWatchlist} from "@/lib/actions/watchlist.actions";

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

interface PageProps {
    params: Promise<{ symbol: string }>;
}

/**
 * Render the stock details page as an async component named StockDetails.
 *
 * It uses a responsive 2-column CSS Grid layout:
 * - Left column: SYMBOL_INFO_WIDGET_CONFIG, CANDLE_CHART_WIDGET_CONFIG, BASELINE_WIDGET_CONFIG.
 * - Right column: WatchlistButton followed by TECHNICAL_ANALYSIS_WIDGET_CONFIG, COMPANY_PROFILE_WIDGET_CONFIG, COMPANY_FINANCIALS_WIDGET_CONFIG.
 *
 * @param params - The dynamic route parameters containing the stock symbol.
 * @returns The React element for the Stock Details page.
 */
async function StockDetails({params}: PageProps) {
    const {symbol} = await params;
    const upperSymbol = symbol.toUpperCase();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isInWatchlist = session?.user?.email
        ? await isStockInWatchlist(upperSymbol, session.user.email)
        : false;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Left Column: Symbol Info, Candle Chart, and Baseline widgets */}
            <div className="lg:col-span-2 flex flex-col gap-8">
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}symbol-info.js`}
                    config={SYMBOL_INFO_WIDGET_CONFIG(upperSymbol)}
                    className="custom-chart"
                    height={200}
                />
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={CANDLE_CHART_WIDGET_CONFIG(upperSymbol)}
                    className="custom-chart"
                    height={500}
                />
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={BASELINE_WIDGET_CONFIG(upperSymbol)}
                    className="custom-chart"
                    height={500}
                />
            </div>

            {/* Right Column: WatchlistButton followed by Technical Analysis, Company Profile, and Company Financials */}
            <div className="lg:col-span-1 flex flex-col gap-8">
                <WatchlistButton
                    symbol={upperSymbol}
                    isInWatchlist={isInWatchlist}
                />
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}technical-analysis.js`}
                    config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(upperSymbol)}
                    className="custom-chart"
                    height={450}
                />
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}symbol-profile.js`}
                    config={COMPANY_PROFILE_WIDGET_CONFIG(upperSymbol)}
                    className="custom-chart"
                    height={450}
                />
                <TradingViewWidget
                    scriptUrl={`${scriptUrl}financials.js`}
                    config={COMPANY_FINANCIALS_WIDGET_CONFIG(upperSymbol)}
                    className="custom-chart"
                    height={450}
                />
            </div>
        </div>
    );
}

export default StockDetails;
