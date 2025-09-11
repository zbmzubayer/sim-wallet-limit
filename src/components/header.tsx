"use client";

import { Logout } from "@/components/auth/logout";

export function Header() {
  return (
    <header className="border-b h-16 flex items-center">
      <div className="container flex items-center justify-between">
        <div className="text-lg font-bold tracking-tight">Sim Wallet Limit</div>
        <Logout />
      </div>
    </header>
  );
}
