'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LoginButton from "../src/components/LoginButton";
import LogoutButton from "../src/components/LogoutButton";
import StartButton from "../src/components/StartButton";
import Profile from "../src/components/Profile";
import Clock from "../src/components/Clock";
import AstralMeshScene from "../src/components/AstralMeshScene";
import CloudsMeshScene from "../src/components/LandscapeMeshScene";
import ThemeToggle from "../src/components/ThemeToggle";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) return null;

  return (
    <>
      {/* Fixed Background Clouds */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <CloudsMeshScene />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col text-center justify-center">
        <ThemeToggle />
        
        <div className="">
          <AstralMeshScene />
        </div>
        
        <div className="">
          <Profile user={user} />
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
    </>
  );
}