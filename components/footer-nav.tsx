"use client";

import Link from "next/link";
import { HomeIcon, ArrowDownIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

export default function FooterNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const base =
    "flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-all text-sm";

  const active =
    "text-primary font-semibold scale-105 bg-base-200 rounded-xl shadow-inner";

  return (
    <div className="fixed bottom-0 bg-base-200 flex justify-around p-0.5 z-50 w-full">
      <Link
        href="/my-debt"
        className={`${base} ${isActive("/my-debt") ? active : "opacity-60"}`}
      >
        <HomeIcon className="w-5 h-5" />
        <span>Мои чеки</span>
      </Link>

      <Link
        href="/friends-debt"
        className={`${base} ${
          isActive("/friends-debt") ? active : "opacity-60"
        }`}
      >
        <ArrowDownIcon className="w-5 h-5" />
        <span>Чеки друзей</span>
      </Link>

      <Link
        href="/history"
        className={`${base} ${isActive("/history") ? active : "opacity-60"}`}
      >
        <ArchiveIcon className="w-5 h-5" />
        <span>История</span>
      </Link>
    </div>
  );
}
