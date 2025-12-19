'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Stars } from '@/components/ui/stars';

/**
 * Represents a single testimonial entity returned from the API.
 */
type Testimonial = {
    id: number;
    author: string;
    role: string;
    rating: number;
    quote: string;
};

/**
 * Rotates through testimonials fetched from the API at a fixed interval.
 * Displays the testimonial content, author details, avatar, and rating.
 */
export function TestimonialRotator({
                                       intervalMs = 6000,
                                   }: {
    intervalMs?: number;
}) {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [index, setIndex] = useState(0);

    /**
     * Fetch testimonials once on mount.
     */
    useEffect(() => {
        fetch('/api/testimonials')
            .then((res) => res.json())
            .then((data) => setItems(data));
    }, []);

    /**
     * Rotate testimonials at the given interval.
     * Automatically cleans up the timer on unmounted or dependency change.
     */
    useEffect(() => {
        if (items.length <= 1) return;

        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, intervalMs);

        return () => clearInterval(id);
    }, [items, intervalMs]);

    // Avoid rendering until data is available
    if (items.length === 0) return null;

    const current = items[index];

    /**
     * Generate a deterministic avatar based on the author's name.
     * Used as a lightweight alternative to stored profile images.
     */
    const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(
        current.author
    )}`;

    return (
        <div className="relative max-w-3xl w-full space-y-4">
            {/* Testimonial quote */}
            <blockquote className="auth-blockquote">
                “{current.quote}”
            </blockquote>

            {/* Author information */}
            <div className="flex items-center gap-3">
                {/* Avatar with status badge */}
                <div className="relative shrink-0">
                    <Image
                        src={avatarUrl}
                        alt={current.author}
                        width={36}
                        height={36}
                        unoptimized
                        className="rounded-full bg-muted"
                    />

                    {/* Verification / status indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>

                {/* Author name and role */}
                <div>
                    <cite className="auth-testimonial-author">
                        — {current.author}
                    </cite>
                    <p className="text-sm text-muted-foreground">
                        {current.role}
                    </p>
                </div>
            </div>

            {/* Rating aligned to the right edge of the viewport */}
            <div className="absolute right-0 bottom-0 pr-12 hidden sm:block">
                <Stars
                    rating={current.rating}
                    size={18}
                    className="text-amber-400"
                    ariaLabel={`${current.rating} out of 5 stars`}
                />
            </div>
        </div>
    );
}
