"use client";

import Link from "next/link";
import { HomeIcon, ArrowDownIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { useSession } from "./session-provider";

export default function FooterNav() {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="fixed bottom-0 bg-base-200 flex justify-around p-2.5 z-50 w-full">
      <Link href="/my-debt" className="flex flex-col items-center">
        <HomeIcon className="w-5 h-5" />
        <span>Мои долги</span>
      </Link>

      <Link href="/friends-debt" className="flex flex-col items-center">
        <ArrowDownIcon className="w-5 h-5" />
        <span>Долги друзей</span>
      </Link>

      <Link href="/history" className="flex flex-col items-center">
        <ArchiveIcon className="w-5 h-5" />
        <span>Bcnjhbz</span>
      </Link>
    </div>
  );
}
