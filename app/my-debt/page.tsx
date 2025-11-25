"use client";

import { useEffect, useState } from "react";
import { getDebtsFromUser } from "@/lib/debts";
import DebtCard from "@/components/debt-card";
import Link from "next/link";
import { Debt } from "@/lib/types";
import { useSession } from "@/components/session-provider";
import { useRouter } from "next/navigation";

export default function MyDebtPage() {
  const [debts, setDebts] = useState<Debt[]>([]);

  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");

      return;
    }

    async function load() {
      const data = await getDebtsFromUser(session.user.id);
      setDebts(data);
    }

    load();
  }, [router, session]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Мой долг</h1>

        <Link href="/create" className="btn btn-primary btn-sm">
          + Создать долг
        </Link>
      </div>

      {debts.length === 0 && <p className="opacity-70">Пока нет долгов</p>}

      {debts.map((d) => (
        <DebtCard key={d.id} debt={d} />
      ))}
    </div>
  );
}
