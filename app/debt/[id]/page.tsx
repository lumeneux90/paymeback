"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Debt } from "@/lib/types";
import DebtCard from "@/components/debt-card";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function DebtPage() {
  const { id } = useParams();

  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthGuard();

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
    <div className="card bg-base-200 shadow-md relative max-w-md mx-auto mt-6">
      {!debt ? (
        <p className="opacity-70">Пока нет чеков</p>
      ) : (
        <DebtCard debt={debt} refresh={load} />
      )}
    </div>
  );
}
