'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {LogOut} from "lucide-react";
import NavItems from "@/components/NavItems";
import {signOutUser} from "@/lib/actions/auth.actions";

interface UserDropDownProps {
    user?: {
        id?: string;
        name?: string;
        email?: string;
        image?: string | null;
        [key: string]: any;
    } | null;
}

const UserDropDown = ({user, initialStocks}: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
    const router = useRouter();

    /* SENIOR NOTE: Calculation inside component scope */
    const userInitials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    const handleSignOut = async () => {
        await signOutUser();
        router.push('/sign-in');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-transparent focus-visible:ring-0 p-0"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt={user?.name || "User"}/>
                        <AvatarFallback className="bg-green-500 text-green-900 text-sm font-bold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="bg-[#0d1117] border-[#30363d] text-gray-200 w-56 shadow-2xl rounded-xl"
                align="end"
            >
                <DropdownMenuLabel className="p-0">
                    <div className="flex items-center gap-3 p-4">
                        <Avatar className="h-10 w-10 border border-[#30363d]">
                            <AvatarImage src={user?.image || "https://github.com/shadcn.png"}
                                         alt={user?.name || "User"}/>
                            <AvatarFallback className="bg-green-500 text-green-900 text-sm font-bold">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-semibold text-white leading-none">
                                {user?.name || "User"}
                            </span>
                            <span className="text-xs text-gray-400 leading-none">
                                {user?.email || "No email provided"}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#30363d] my-1"/>

                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-300 focus:text-white focus:bg-[#1f242c] cursor-pointer py-3 px-4 m-1 rounded-md"
                >
                    <LogOut className="h-4 w-4 mr-3"/>
                    Log Out
                </DropdownMenuItem>

                {/* SENIOR FIX:
                    Passing 'className' prop to override the default 'sm:flex-row'.
                    'flex-col' forces vertical layout.
                    '!items-start' forces left alignment.
                    'sm:gap-2' reduces the gap for the tight dropdown space.
                */}
                <div className="px-2 pb-2">
                    <NavItems className="flex-col sm:flex-col items-start sm:gap-1 p-0" initialStocks={initialStocks}/>
                </div>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropDown;