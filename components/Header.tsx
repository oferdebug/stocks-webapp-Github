import Image from 'next/image';
import Link from 'next/link';

import NavItems from '@/components/NavItems';
import UserDropDown from '@/components/UserDropDown';
import {searchStocks} from "@/lib/actions/finnhub.actions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HeaderProps {
    user: {
        id?: string;
        name?: string;
        email?: string;
        image?: string | null;
        [key: string]: unknown;
    } | null;
}

// This Is Test

const Header = async ({user}: { user: User }) => {
    const initialStocks = await searchStocks('');
    return (
        <header className="sticky top-0 z-50 w-full bg-black border-b border-gray-800">
            {/* Three-column grid for absolute centering of the middle item */}
            <div className="grid grid-cols-3 h-16 w-full px-6 items-center">

                {/* Left Section: Logo */}
                <div className="flex justify-start">
                    <Link href="/">
                        <Image
                            src="/assets/icons/logo1-nexttrade-dark (1).svg"
                            alt="NextTrade Logo"
                            width={160}
                            height={40}
                            className="h-9 w-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Center Section: Navigation Links */}
                <nav className="hidden sm:flex justify-center">
                    <NavItems initialStocks={initialStocks}/>
                </nav>

                {/* Right Section: User Icon */}
                <div className="flex justify-end">
                    <UserDropDown user={user} initialStocks={initialStocks}/>
                </div>

            </div>
        </header>
    );
};

export default Header;

