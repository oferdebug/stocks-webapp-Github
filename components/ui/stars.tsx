'use client';
type StarsProps = {
    /** Rating value, e.g. 4.5 */
    rating: number;
    /** Maximum stars (default 5) */
    max?: number;
    /** Size in px (default 24) */
    size?: number;
    /** Gap between stars in px (default 8) */
    gap?: number;
    /** Fill color (Tailwind/className via currentColor works best) */
    fillClassName?: string;
    /** Outline color */
    strokeClassName?: string;
    /** Outline thickness */
    strokeWidth?: number;
    /** Accessible label override */
    ariaLabel?: string;
    /** Additional wrapper class */
    className?: string;
};

const STAR_PATH =
    "M12 2.5l2.92 5.92 6.53.95-4.72 4.6 1.11 6.48L12 17.77l-5.84 3.06 1.11-6.48-4.72-4.6 6.53-.95L12 2.5z";

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

export function Stars({
                          rating,
                          max = 5,
                          size = 24,
                          gap = 8,
                          fillClassName = "text-yellow-400",
                          strokeClassName = "text-amber-700",
                          strokeWidth = 1.5,
                          ariaLabel,
                          className,
                      }: StarsProps) {
    const safeMax = Math.max(1, Math.floor(max));
    const safeRating = clamp(rating, 0, safeMax);

    const width = safeMax * size + (safeMax - 1) * gap;
    const height = size;

    return (
        <div
            className={className}
            role="img"
            aria-label={ariaLabel ?? `Rating ${safeRating} out of ${safeMax}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                fill="none"
            >
                <defs>
                    <symbol id="star-shape" viewBox="0 0 24 24">
                        {/* Empty (outline) */}
                        <path
                            d={STAR_PATH}
                            fill="none"
                            className={strokeClassName}
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                        {/* Full (fill + outline) */}
                        <path
                            d={STAR_PATH}
                            className={fillClassName}
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinejoin="round"
                        />
                    </symbol>
                </defs>

                {Array.from({ length: safeMax }).map((_, i) => {
                    const x = i * (size + gap);

                    const starValue = safeRating - i; // how much this star is filled
                    const fillRatio = clamp(starValue, 0, 1); // 0..1

                    // Unique clipPath per star to support partial fills
                    const clipId = `clip-${i}`;

                    return (
                        <g key={i} transform={`translate(${x} 0)`}>
                            {/* Outline only star */}
                            <svg width={size} height={size} viewBox="0 0 24 24">
                                <path
                                    d={STAR_PATH}
                                    fill="none"
                                    className={strokeClassName}
                                    stroke="currentColor"
                                    strokeWidth={strokeWidth}
                                    strokeLinejoin="round"
                                />
                            </svg>

                            {/* Partial/Full fill clipped */}
                            {fillRatio > 0 && (
                                <>
                                    <clipPath id={clipId}>
                                        <rect x="0" y="0" width={24 * fillRatio} height="24" />
                                    </clipPath>

                                    <svg
                                        width={size}
                                        height={size}
                                        viewBox="0 0 24 24"
                                        clipPath={`url(#${clipId})`}
                                    >
                                        <path
                                            d={STAR_PATH}
                                            className={fillClassName}
                                            fill="currentColor"
                                            stroke="currentColor"
                                            strokeWidth={strokeWidth}
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default Stars;