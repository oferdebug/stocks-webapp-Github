import React from "react";
import Header from "@/components/Header";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/dist/server/request/headers";
import {redirect} from "next/navigation";


const Layout =async ({ children }: { children: React.ReactNode }) => {
    const session=await auth.api.getSession({
        headers:await headers(),
    });

    if (!session?.user) redirect('/sign-in')
    const user={...session.user};
    user.image=session.user.image ||null;

  return (
    <main className="min-h-screen text-gray-200">
      <Header user={user} />
      <div className={"container py-10 home-wrapper"}>{children}</div>
    </main>
  );
}

export default Layout;