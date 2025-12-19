'use client';

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { TestimonialRotator } from "@/components/testimonials/TestimonialRotator";
import Stars from "@/components/ui/stars";

function Layout({ children }: { children: ReactNode }) {
    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo">
                    <Image
                        src="/assets/icons/logo1-nexttrade-dark (1).svg"
                        alt="NextTrade Logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                <div className="pb-7 lg:pb-9 flex-1">
                    {children}
                </div>
            </section>

            <section className="auth-right-section">
                <div className='z-10 relative lg:mt-4 lg:mb-16'>
                    <div className={'grid grid-cols-[minmax(0,1fr)_auto] items-end w-full'}>
                    <TestimonialRotator intervalMs={7000} />
                        

                        </div>
                    </div>

                <section className="flex-1 relative">
                    <Image
                        src="/assets/icons/dashboard-preview.png"
                        alt="Dashboard Preview"
                        width={1440}
                        height={1150}
                        className="auth-dashboard-preview absolute top-0"
                    />
                </section>
            </section>
        </main>
    );
}

export default Layout;
