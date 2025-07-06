"use client";

import Cube from "@/components/Cube";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen w-screen relative overflow-hidden bg-gradient-to-b from-indigo-900 to-black">
      <Header />
      <main className="h-full w-full flex items-center justify-center">
        <Cube />
      </main>
    </div>
  );
}
