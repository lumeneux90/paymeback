"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Debt } from "@/lib/types";
import confetti from "canvas-confetti";

export default function ReceiptPage() {
  const { id } = useParams();

  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setDebt(data);
      }
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <p className="opacity-70">Загрузка...</p>;
  if (!debt) return <p>Долг не найден</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-200 shadow-xl p-6 text-center relative">
        <h1 className="text-3xl font-bold mb-4 text-success">ДОЛГ ПОГАШЁН</h1>

        <div className="mb-4">
          <p className="text-4xl font-semibold">{debt.amount} ₽</p>
          <p className="badge badge-neutral mt-2">{debt.tag}</p>
        </div>

        <p className="opacity-70 mb-4">{debt.description || "Без описания"}</p>

        <p className="text-xs opacity-50">
          Оплачено:{" "}
          {debt.paid_at
            ? new Date(debt.paid_at).toLocaleString()
            : "Дата неизвестна"}
        </p>

        <div className="divider"></div>

        <Link href="/my-debt" className="btn btn-primary mt-4">
          ← Вернуться
        </Link>
      </div>
    </div>
  );
}
