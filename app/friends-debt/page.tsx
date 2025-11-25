"use client";

import { useEffect, useState } from "react";
import { getDebtsToUser } from "@/lib/debts";
import DebtCard from "@/components/debt-card";
import { Debt } from "@/lib/types";
import { useSession } from "@/components/session-provider";
import { useRouter } from "next/navigation";

export default function FriendsDebtPage() {
  const [debts, setDebts] = useState<Debt[]>([]);

  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");

      return;
    }

    async function load() {
      const data = await getDebtsToUser(session.user.id);
      setDebts(data);
    }

    load();
  }, [router, session]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-3">Долг друзей</h1>

      {debts.length === 0 && <p className="opacity-70">Пока нет долгов</p>}

      {debts.map((d) => (
        <DebtCard key={d.id} debt={d} />
      ))}
    </div>
  );
}
