"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Debt } from "@/lib/types";
import DebtCard from "@/components/debt-card";

export default function DebtPage() {
  const { id } = useParams();

  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Загружаем долг
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="opacity-70">Загружаем...</p>;
  if (!debt) return <p className="opacity-70">Долг не найден</p>;

  return (
    <div className="card bg-base-200 shadow-md relative max-w-md mx-auto mt-6">
      <DebtCard debt={debt} refresh={load} />
    </div>
  );
}
