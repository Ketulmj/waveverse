"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return <div className="flex min-h-svh flex-col items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-black p-6 text-white">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-lg text-white/80">
          Welcome back, {session.user?.name ?? session.user?.email}!
        </p>
        <div className="mt-8">
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-white/90 text-black hover:bg-white/80"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}