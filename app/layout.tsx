import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {Toaster} from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "NextTrade",
    description:
        "The ultimate data-driven trading ecosystem. NextTrade transforms complex market variables into actionable insights, helping you execute trades with precision and confidence.",
};

const Layout = async ({children}: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
        <main className="min-h-screen text-gray-200">
            {children}
            <Toaster/>
        </main>
        </body>
        </html>
    );
};

export default Layout;
