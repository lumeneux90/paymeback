"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Debt } from "@/lib/types";
import { colorLine } from "@/lib/constants";
import { DebtStatus } from "@/lib/enums";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function DebtPage() {
  const { id } = useParams();
  const router = useRouter();

  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);

  // Загружаем долг
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

  if (loading) return <p className="opacity-70">Загружаем...</p>;
  if (!debt) return <p className="opacity-70">Долг не найден</p>;

  // Кнопки действий
  const handlePaid = async () => {
    await supabase
      .from("debts")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", debt.id);

    router.push(`/debt/${debt.id}/receipt`);
  };

  const handleDelete = async () => {
    await supabase.from("debts").delete().eq("id", debt.id);
    router.push("/my-debt");
  };

  return (
    <div className="card bg-base-200 shadow-md relative max-w-md mx-auto mt-6">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${colorLine[debt.status]}`}
      />

      <div className="card-body p-6">
        <h1 className="text-2xl font-bold mb-2">{debt.amount} ₽</h1>

        {debt.tag && (
          <span className="badge badge-neutral mb-3">{debt.tag}</span>
        )}

        <p className="opacity-80 mb-2">{debt.description}</p>

        <p className="text-xs opacity-50 mb-4">
          {new Date(debt.created_at).toLocaleString()}
        </p>

        {/* СБП-ссылка */}
        {debt.sbp_link && (
          <a
            href={debt.sbp_link}
            target="_blank"
            className="btn btn-primary w-full"
          >
            Оплатить через СБП
          </a>
        )}

        {/* Кнопка "Я оплатил" */}
        {debt.status !== DebtStatus.PAID && (
          <button className="btn btn-success w-full mt-3" onClick={handlePaid}>
            Я оплатил
          </button>
        )}

        {/* Дополнительные кнопки */}
        <div className="flex gap-2 mt-4">
          <Link href="/my-debt" className="btn btn-outline">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Назад</span>
          </Link>

          <button
            className="btn btn-outline btn-error flex-1"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
