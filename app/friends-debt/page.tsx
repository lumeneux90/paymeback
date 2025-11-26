"use client";

import { useEffect, useState } from "react";
import { getDebtsToUser } from "@/lib/debts";
import DebtCard from "@/components/debt-card";
import { Debt } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function FriendsDebtPage() {
  const [debts, setDebts] = useState<Debt[]>([]);

  const { user, loading } = useAuthGuard();

  const router = useRouter();

  useEffect(() => {
    async function load() {
      if (!user) {
        return;
      }

      const data = await getDebtsToUser(user.id);
      setDebts(data);
    }

    load();
  }, [router, user]);

  if (loading) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-3">Чеки друзей</h1>

      {debts.length === 0 && <p className="opacity-70">Пока нет чеков</p>}

      {debts.map((d) => (
        <DebtCard key={d.id} debt={d} />
      ))}
    </div>
  );
}
