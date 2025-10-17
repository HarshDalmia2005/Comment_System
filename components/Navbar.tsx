"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="w-full flex items-center p-4 bg-[#322F20] text-[#988F2A]">
      <h1 className="text-2xl font-bold">TechAGram</h1>

      <div className="ml-auto flex items-center gap-2">
        {status === "loading" ? (
          <span className="text-sm">Checking...</span>
        ) : session?.user ? (
          <>
            <span className="text-sm">{session.user.name ?? session.user.email}</span>
            <button
              className="px-3 py-1 bg-[#988F2A] text-[#322F20] rounded-md text-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="px-3 py-1 bg-[#988F2A] text-[#322F20] rounded-md text-sm"
            onClick={() => router.push("/login")}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}