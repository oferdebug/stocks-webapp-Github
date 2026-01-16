'use client';

import Link from "next/link";
import Image from "next/image";
import type {ReactNode} from "react";
import {TestimonialRotator} from "@/components/testimonials/TestimonialRotator";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";

/**
 * Page layout for authentication-like screens with a left content column and a right preview column.
 *
 * The left column displays the site logo and renders the provided `children`. The right column shows a testimonial rotator and a decorative dashboard preview.
 *
 * @param children - Content to render in the left column (typically authentication forms or related content).
 * @returns A JSX element representing the two-column auth layout with logo, content area, testimonial rotator, and dashboard preview.
 */
function Layout({children}: { children: ReactNode }) {
    const pathname = usePathname();
    const isSignIn = pathname === "/sign-in";

    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default relative">
                <div
                    className="absolute top-0 left-0 right-0 flex justify-between items-center w-full py-8 lg:py-12 z-20">
                    <Link href="/" className="auth-logo">
                        <Image
                            src="/assets/icons/logo1-nexttrade-dark (1).svg"
                            alt="NextTrade Logo"
                            width={140}
                            height={40}
                            className="h-10 lg:h-12 w-auto"
                            priority
                        />
                    </Link>

                    <div>
                        {isSignIn ? (
                            <Button asChild variant="outline"
                                    className="text-white border-white/20 hover:bg-white/10 px-8 h-12 text-lg">
                                <Link href="/sign-up">Sign Up</Link>
                            </Button>
                        ) : (
                            <Button asChild variant="outline"
                                    className="text-white border-white/20 hover:bg-white/10 px-8 h-12 text-lg">
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div
                    className="flex-1 flex flex-col justify-center py-32 lg:py-20 max-w-[500px] mx-auto w-full min-h-screen">
                    {children}
                </div>
            </section>

            <section className="auth-right-section flex flex-col justify-center items-center px-10">
                <div className='z-10 relative lg:mt-4 lg:mb-8 max-w-[850px] w-full'>
                    <div className={'flex flex-col items-center text-center w-full'}>
                        <TestimonialRotator intervalMs={7000}/>
                    </div>
                </div>

                {/* Dashboard Preview  */}
                <div className="relative mt-10 flex justify-center w-full">
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full"/>
                    <div className="relative dashboard-preview-container [perspective:2000px] w-full max-w-[850px]">
                        <Image
                            src="/assets/images/485_1x_shots_so.png"
                            alt="NextTrade Dashboard Preview"
                            width={1200}
                            height={800}
                            className="rounded-2xl border border-white/10 shadow-2xl transform-gpu transition-all duration-700 ease-out [rotateX:12deg] [rotateY:-8deg] [rotateZ:1deg] hover:[rotateX:0deg] hover:[rotateY:0deg] hover:[rotateZ:0deg] hover:scale-[1.02]"
                            priority
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Layout;