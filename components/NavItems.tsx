'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from '@/lib/constants'; // or '@/constants'
import { cn } from "@/lib/utils"; // SENIOR NOTE: Using 'cn' utility from Shadcn to merge classes properly

/* SENIOR NOTE:
   Added 'className' prop to make the component reusable in different contexts
   (e.g., Header horizontal menu vs Dropdown vertical menu).
*/
const NavItems = ({ className }: { className?: string }) => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    }

    return (
        <ul className={cn(
            // Default styles (Mobile: Column, Desktop: Row)
            'flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium',
            // External styles override (allows us to force 'flex-col' in dropdown)
            className
        )}>
            {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                    <Link href={href} className={cn(
                        "transition-colors",
                        isActive(href) ? 'text-green-500' : 'text-white hover:text-green-500'
                    )}>
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    );
};
export default NavItems;