import React from "react";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen text-gray-200">
      <Header />
      <div className={"container py-10 home-wrapper"}>{children}</div>
    </main>
  );
}
