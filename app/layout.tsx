import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import {Toaster} from "@/components/ui/sonner";
import Header from "@/components/Header";

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

const Layout = async ({children, session}: { children: React.ReactNode, session: any }) => {
    const user = session?.user ? {
        ...session.user,
        image: session.user.image || null,
    } : null; // Use null instead of undefined for easier prop handling

    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
        <body className="antialiased bg-gray-900">
        <main className="min-h-screen text-gray-200">
            {/* Cast to User to satisfy the prop requirement */}
            <Header user={user as User}/>
            <div className={"container py-10 home-wrapper mx-auto"}>{children}</div>
        </main>
        </body>
        </html>
    );
};
export default Layout;
