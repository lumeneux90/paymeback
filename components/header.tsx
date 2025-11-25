"use client";

import { SunIcon, MoonIcon, PersonIcon, ExitIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { logout } from "@/lib/auth";
import { useSession } from "./session-provider";
import { Theme } from "@/lib/enums";
import { useRouter } from "next/navigation";

export default function Header() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="navbar bg-base-200 shadow-sm p-4">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">PayMeBack</h1>
      </div>
      <div className="flex gap-2 items-center">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          aria-label="Тема"
          onClick={() =>
            setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
          }
        >
          {theme === Theme.LIGHT ? <MoonIcon /> : <SunIcon />}
        </button>

        <button
          className="btn btn-sm btn-ghost btn-circle"
          aria-label="Пользователь"
        >
          <PersonIcon className="w-5 h-5" />
        </button>

        <button
          className="btn btn-sm btn-ghost btn-circle"
          aria-label="Выход"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <ExitIcon className="text-error w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
