'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LoginButton from "../src/components/LoginButton";
import LogoutButton from "../src/components/LogoutButton";
import StartButton from "../src/components/StartButton";
import Profile from "../src/components/Profile";
import Clock from "../src/components/Clock";
import AstralMeshSceneWrapper from "../src/components/AstralMeshSceneWrapper";
import ThemeToggle from "../src/components/ThemeToggle";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { theme } = useTheme();
  const { user, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) return null;

  return (
    <main className={`flex-col text-center justify-center min-h-screen`}>
      <ThemeToggle />
      
      <div className="">
        <AstralMeshSceneWrapper />
      </div>
      
      <div className="">
        <Profile user={user} />
      </div>
      
      <div className="">
        chaos
      </div>

      <div className="flex justify-center">
        <StartButton />
        {user ? (
          <div className="">
            <LogoutButton />
          </div>
        ) : (
          <div className="">
            <LoginButton />
          </div>
        )}
      </div>

      <div className="text-right">
        <Clock />
      </div>
    </main>
  );
}