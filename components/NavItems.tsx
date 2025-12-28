'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {NAV_ITEMS} from '@/lib/constants';

const NavItems=()=>{
    const pathname=usePathname();

    const isActive=(path:string)=>{
        if (path==='/') return pathname==='/';
    }
    return (
        <ul className={'flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'}>
            {NAV_ITEMS.map(({href,label})=>(
                <li key={href}>
                    <Link href={href} className={`transition-colors ${
                        isActive(href) ? 'text-green-500' : 'text-white hover:text-green-500'
                    }`}>
                    {label}
                </Link>
        </li>
            ))}
        </ul>
    );
};
export default NavItems;
