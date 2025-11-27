"use client";

import { useEffect, useState } from "react";
import { getDebtsToUser } from "@/lib/debts";
import DebtCard from "@/components/debt-card";
import { Debt } from "@/lib/types";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function FriendsDebtPage() {
  const [debts, setDebts] = useState<Debt[]>([]);

  const { user, loading } = useAuthGuard();

  async function load() {
    if (!user) {
      return;
    }

    const data = await getDebtsToUser(user.id);
    setDebts(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-3">Чеки друзей</h1>

      {debts.length === 0 && <p className="opacity-70">Пока нет чеков</p>}

      {debts.map((d) => (
        <DebtCard key={d.id} debt={d} refresh={load} />
      ))}
    </div>
  );
}
