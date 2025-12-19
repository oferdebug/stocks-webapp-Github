import {NextResponse} from "next/server";

export async function GET() {
    return NextResponse.json([
        {
            id:1,
            author:'Sarah Mitchell',
            role:'Day Trader',
            rating:4.5,
            quote:'NextTrade has completely transformed how I monitor my portfolio. The AI-powered alerts caught a major price movement before my old platform even updated.',
        },
        {
            id:2,
            author:'Daniel Cohen',
            role:'Swing Trader',
            rating:5,
            quote:'The real-time data and clean UI make decision-making incredibly fast. This is the first platform I actually enjoy using daily.',
        },
        {
            id: 3,
            author: "Lena Fischer",
            role: "Crypto Analyst",
            rating: 4,
            quote:
                'Custom watchlist and instant alerts are game changers. I trust NextTrade with every trade I make.',
        },
    ]);
}