"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 w-full bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06]">
        <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-white/10 rounded-full animate-pulse w-2/3" />
          <div className="h-3 bg-white/10 rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="">
      <span className="">
        Hello, {user.name}
      </span>
    </div>
  );
}