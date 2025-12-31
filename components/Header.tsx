import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropDown from "@/components/UserDropDown";

interface HeaderProps {
    user: {
        id?: string;
        name?: string;
        email?: string;
        image?: string | null;
        [key: string]: any;
    } | null;
}

const Header = ({ user }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
            <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex h-16 items-center justify-between">
                <Link href="/">
                    <Image
                        src="/assets/icons/logo1-nexttrade-dark (1).svg"
                        alt="NextTrade Logo"
                        width={200}
                        height={200}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>
                <nav className="hidden sm:block">
                    <NavItems />
                </nav>
                <UserDropDown asChild={false} user={user} />
            </div>
        </header>
    )
}

export default Header;