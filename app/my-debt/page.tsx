"use client";

import { useEffect, useState } from "react";
import { getDebtsFromUser } from "@/lib/debts";
import DebtCard from "@/components/debt-card";
import Link from "next/link";
import { Debt } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function MyDebtPage() {
  const [debts, setDebts] = useState<Debt[]>([]);

  const { user, loading } = useAuthGuard();

  const router = useRouter();

  useEffect(() => {
    async function load() {
      if (!user) {
        return;
      }

      const data = await getDebtsFromUser(user.id);
      setDebts(data);
    }

    load();
  }, [router, user]);

  if (loading) return <p className="p-4">Загрузка...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Мои чеки</h1>

        <Link href="/create" className="btn btn-primary btn-sm">
          + Создать чек
        </Link>
      </div>

      {debts.length === 0 && <p className="opacity-70">Пока нет чеков</p>}

      {debts.map((d) => (
        <DebtCard key={d.id} debt={d} />
      ))}
    </div>
  );
}
