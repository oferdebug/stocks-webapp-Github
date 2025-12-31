'use client';

import Link from "next/link";
import Image from "next/image";
import type {ReactNode} from "react";
import {TestimonialRotator} from "@/components/testimonials/TestimonialRotator";
import {cn} from "@/lib/utils"; // Adjust the import path based on your project structure

function Layout({ children }: { children: ReactNode }) {
    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default scroll-pt-12">
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

            <section className="auth-right-section flex flex-col justify-center px-10 order-2 lg:order-2">
                <div className='z-0 relative lg:mt-4 lg:mb-8'>
                    <div className={'grid grid-cols-1 items-end w-full'}>
                        <TestimonialRotator intervalMs={7000} />
                    </div>
                </div>

                {/* Dashboard Preview  */}
                <div className="relative mt-10 flex justify-center w-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full" />
                    <div className="relative dashboard-preview-container [perspective:2000px] w-full max-w-[850px]">
                        <Image
                            src="/assets/images/485_1x_shots_so.png"
                            alt="NextTrade Dashboard Preview"
                            width={1200}
                            height={800}
                            className={cn(
                                "rounded-2xl border border-white/10 shadow-2xl",
                                "transform-gpu transition-all duration-700 ease-out",
                                "[rotateX:12deg] [rotateY:-8deg] [rotateZ:1deg]",
                                "hover:[rotateX:0deg] hover:[rotateY:0deg] hover:[rotateZ:0deg] hover:scale-[1.02]"
                            )}
                            priority
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Layout;