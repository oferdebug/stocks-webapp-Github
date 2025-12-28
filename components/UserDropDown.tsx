'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";

{/* Senior Note: Defining the user as optional (?) and allowing null/undefined
    is crucial for Next.js apps where the session might be loading. */
}

interface UserDropDownProps {
    user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        [key: string]: any;
    } | null;

    asChild?: boolean;
}



const UserDropDown = ({ user, asChild }: UserDropDownProps) => {
    
    const router = useRouter();

    const handleSignOut = () => {
        {/* Logic for sign-out should clear the session/cookies before redirecting */}
        router.push('/sign-in');
    };

    {/* Pre-calculating initials to keep the JSX clean and readable */}
    const userInitials = user?.name?.[0]?.toUpperCase() || 'User';
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-3 text-'white'-400 hover:text-green-500 focus-visible:ring-green-0"
                >
                    <Avatar className="h-8 w-8">
                        {/* Senior Tip: Use user?.image if your auth provider supports it, otherwise fall back to default */}
                        <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-green-400 text-green-900 text-sm font-bold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-base font-medium text-white-400 hover:text-green-500">
                            {user?.name || "Guest"}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
                            <AvatarFallback className="bg-green-500 text-green-900 text-sm font-bold">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-400">
                                {/* Fixed: Displaying full name instead of just the initial inside the dropdown */}
                                {user?.name || "User"}
                            </span>
                            <span className="text-sm text-gray-500">
                                {user?.email || "No email provided"}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="hidden sm:block bg-green-600" />

                {/* Mobile Navigation fallback integrated into the dropdown */}
                <nav className="sm:hidden">
                    <NavItems />
                    <DropdownMenuSeparator className="bg-green-600" />
                </nav>

                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-200 text-md font-medium focus:text-green-500 transition-colors cursor-pointer"
                >
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropDown;