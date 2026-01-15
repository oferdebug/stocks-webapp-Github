import React from "react";
import Header from "@/components/Header";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";


const Layout = async ({children}: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) redirect('/sign-in')

    const user = session?.user ? {
        ...session.user,
        image: session.user.image || null,
    } : null;

    return (
        <main className="min-h-screen">
            <Header user={user as User}/>
            <div className={"container py-10 home-wrapper mx-auto"}>
                {children}
            </div>
        </main>
    );
}

export default Layout;