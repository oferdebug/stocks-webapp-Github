import React from "react";
import Header from "@/components/Header";

/**
 * Page layout component that renders a header and wraps page content in a container.
 *
 * @param children - Content to be rendered inside the layout's container
 * @returns The layout JSX element containing the Header and the provided children
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen text-gray-200">
      <Header />
      <div className={"container py-10 home-wrapper"}>{children}</div>
    </main>
  );
}