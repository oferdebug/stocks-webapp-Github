import TradingViewWidget from "@/components/TradingViewWidget";
import {TOP_STORIES_WIDGET_CONFIG} from "@/lib/constants";

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

export default function NewsPage() {
    const WIDGET_HEIGHT = 800;
    const SIDE_WIDGET_HEIGHT = WIDGET_HEIGHT / 2;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white">Market News</h1>
                <p className="text-gray-400">Stay informed with the latest market-moving headlines and real-time
                    updates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TradingViewWidget
                        title="Latest Stories"
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={{
                            ...TOP_STORIES_WIDGET_CONFIG,
                            height: WIDGET_HEIGHT,
                        }}
                        className="custom-chart"
                        height={WIDGET_HEIGHT}
                    />
                </div>

                <div className="flex flex-col gap-8">
                    <TradingViewWidget
                        title="Market Events"
                        scriptUrl={`${scriptUrl}events.js`}
                        config={{
                            colorTheme: "dark",
                            isTransparent: true,
                            width: "100%",
                            height: SIDE_WIDGET_HEIGHT,
                            locale: "en",
                            importanceFilter: "-1,0,1",
                            currencyFilter: "USD,EUR,GBP"
                        }}
                        className="custom-chart"
                        height={SIDE_WIDGET_HEIGHT}
                    />

                    <TradingViewWidget
                        title="Hot Stocks News"
                        scriptUrl={`${scriptUrl}hotlists.js`}
                        config={{
                            colorTheme: "dark",
                            dateRange: "12M",
                            exchange: "US",
                            showChart: true,
                            locale: "en",
                            largeChartUrl: "",
                            isTransparent: true,
                            showSymbolLogo: true,
                            showFloatingTooltip: false,
                            width: "100%",
                            height: SIDE_WIDGET_HEIGHT,
                            plotLineColorGrowing: "rgba(41, 98, 255, 1)",
                            plotLineColorFalling: "rgba(41, 98, 255, 1)",
                            gridLineColor: "rgba(240, 243, 250, 0)",
                            scaleFontColor: "rgba(106, 109, 120, 1)",
                            belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
                            belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
                            belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
                            belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
                            symbolActiveColor: "rgba(41, 98, 255, 0.12)"
                        }}
                        className="custom-chart"
                        height={SIDE_WIDGET_HEIGHT}
                    />
                </div>
            </div>
        </div>
    );
}
