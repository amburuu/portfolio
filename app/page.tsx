'use client'

import { useEffect, useState } from "react";
import Clock from "../src/components/Clock";
import AstralMeshScene from "../src/components/AstralMeshScene";
import SceneView from "../src/components/SceneView";
import ThemeToggle from "../src/components/ThemeToggle";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 w-full h-screen z-0">
        <SceneView />
      </div>
      <main className="relative z-10 flex flex-col text-center justify-center">
        <ThemeToggle />
        <div className="">
          <AstralMeshScene />
        </div>
        <div className="text-right">
          <Clock />
        </div>
      </main>
    </>
  );
}