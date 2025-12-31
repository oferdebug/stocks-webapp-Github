import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

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

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user ? {
        ...session.user,
        image: session.user.image || null,
    } : null;

    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
        <main className="min-h-screen text-gray-200">
            <Header user={user} />
            <div className={"container py-10 home-wrapper"}>
                {children}
            </div>
            <Toaster />
        </main>
        </body>
        </html>
    );
};

export default Layout;
