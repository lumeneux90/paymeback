"use client";

import { useEffect, useState } from "react";
import { loginByName } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";

export default function LoginPage() {
  const [name, setName] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!name.trim()) return;

    await loginByName(name.trim());

    router.push("/my-debt");
  };

  const session = useSession();

  // Авторедирект в приложение, если сессия уже есть
  useEffect(() => {
    if (session) {
      router.push("/my-debt");
    }
  }, [router, session]);

  return (
    <div className="max-w-xs mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>

      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Как тебя зовут?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="btn btn-primary w-full" onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
}
