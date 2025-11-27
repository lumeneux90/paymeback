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

  const { user, loading } = useAuthGuard();

  async function load() {
    if (!user) {
      return;
    }

    const data = await getDebtsFromUser(user.id);
    setDebts(data);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="p-4">Загрузка...</p>;

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
