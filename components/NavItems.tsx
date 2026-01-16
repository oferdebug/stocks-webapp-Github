'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {NAV_ITEMS} from "@/lib/constants"; // or '@/constants'
import {cn} from "@/lib/utils";
import {LayoutDashboard, Search, Star, Newspaper} from "lucide-react";
import {SearchCommand} from "@/components/SearchCommand";

/* SENIOR NOTE:
   Added 'className' prop to make the component reusable in different contexts
   (e.g., Header horizontal menu vs. a Dropdown vertical menu).
*/
const NavItems = ({className}: { className?: string }) => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const getIcon = (label: string) => {
        switch (label) {
            case "Dashboard":
                return <LayoutDashboard className="h-4 w-4"/>;
            case "Search":
                return <Search className="h-4 w-4"/>;
            case "Watchlist":
                return <Star className="h-4 w-4"/>;
            case "News":
                return <Newspaper className="h-4 w-4"/>;
            default:
                return null;
        }
    };

    return (
        <ul
            className={cn(
                // We want a tight flex row, no extra width
                "flex items-center gap-6 font-medium w-auto",
                className
            )}>
            {NAV_ITEMS.map(({href, label}) => {
                const icon = getIcon(label);
                const active = isActive(href);

                if (label === "Search") {
                    return (
                        <li key={href}>
                            <SearchCommand
                                renderAs="text"
                                label={
                                    <>
                                        {icon}
                                        {label}
                                    </>
                                }
                                className={cn(
                                    "transition-colors flex items-center gap-1.5 cursor-pointer",
                                    active
                                        ? "text-green-500"
                                        : "text-white hover:text-green-500"
                                )}
                            />
                        </li>
                    );
                }

                return (
                    <li key={href}>
                        <Link
                            href={href}
                            className={cn(
                                "transition-colors flex items-center gap-1.5",
                                active
                                    ? "text-green-500"
                                    : "text-white hover:text-green-500"
                            )}>
                            {icon}
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
export default NavItems;