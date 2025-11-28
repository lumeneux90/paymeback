"use client";

import { useEffect, useState } from "react";
import { getDebtsFromUser } from "@/lib/debts";
import DebtCard from "@/components/debt-card";
import Link from "next/link";
import { Debt } from "@/lib/types";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { PlusIcon } from "@radix-ui/react-icons";

export default function MyDebtPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthGuard();

  async function load() {
    if (!user) {
      return;
    }

    const data = await getDebtsFromUser(user.id);

    setDebts(data);
    setLoading(false);
  }

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading)
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <span className="loading loading-infinity loading-xl text-primary"></span>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Мои чеки</h1>

        <Link href="/create" className="btn btn-primary btn-sm">
          <PlusIcon /> Создать чек
        </Link>
      </div>

      {debts.length === 0 && <p className="opacity-70">Пока нет чеков</p>}

      {debts.map((d) => (
        <DebtCard key={d.id} debt={d} refresh={load} />
      ))}
    </div>
  );
}
