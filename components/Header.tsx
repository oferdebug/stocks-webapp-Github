import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropDown from "@/components/UserDropDown";
import Link from "next/link";
const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-black">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/">
                    <Image
                        src="/assets/icons/logo1-nexttrade-dark (1).svg"
                        alt="TradeIQ Logo"
                        width={200}
                        height={200}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>

                <nav className="hidden sm:block">
                    <NavItems />
                </nav>

                <UserDropDown asChild={false} />
            </div>
        </header>

    )
}
export default Header
