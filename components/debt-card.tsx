"use client";

import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabaseClient";
import { Debt } from "@/lib/types";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { DebtStatus } from "@/lib/enums";
import { colorLine } from "@/lib/constants";

export default function DebtCard({ debt }: { debt: Debt }) {
  const { user } = useAuthGuard();

  if (!user) {
    return;
  }

  const isCreditor = user.id === debt.from_user;
  const isDebtor = user.id === debt.to_user;

  const paymentUrl = debt?.to_user_data
    ? `https://qr.nspk.ru/?phone=${debt.to_user_data.phone}&sum=${debt.amount}&comment=Debt%20${debt.id}`
    : "";

  async function markPaid() {
    await supabase
      .from("debts")
      .update({ status: DebtStatus.WAITING })
      .eq("id", debt.id);
  }

  async function confirmPaid() {
    await supabase
      .from("debts")
      .update({ status: DebtStatus.PAID })
      .eq("id", debt.id);
  }

  return (
    <div className="card bg-base-200 shadow-lg p-3 mb-4">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${colorLine[debt.status]}`}
      ></div>
      <div className="card-body p-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{debt.amount} ₽</h2>
          <span className="badge badge-secondary font-semibold">
            {user?.id === debt.from_user
              ? debt.to_user_data?.name
              : debt.from_user_data?.name}
          </span>
        </div>
        {debt.description && (
          <p className="text-sm opacity-70">{debt.description}</p>
        )}
        <p className="text-xs opacity-50">
          {new Date(debt.created_at).toLocaleDateString()}
        </p>
        {debt.tag && <span className="badge badge-neutral">{debt.tag}</span>}
        {/* ----- Должник ----- */}
        {isDebtor && debt.status === "pending" && (
          <>
            <h4 className="font-semibold mb-3 self-center">Оплата через СБП</h4>

            <div className="flex justify-center my-2">
              <QRCode value={paymentUrl} size={160} />
            </div>

            <a
              href={paymentUrl}
              target="_blank"
              className="btn btn-primary w-full mb-2"
            >
              Оплатить через СБП
            </a>

            <button className="btn w-full btn-neutral" onClick={markPaid}>
              Я оплатил
            </button>
          </>
        )}
        {/* ----- Автор: ждет подтверждения ----- */}
        {isCreditor && debt.status === DebtStatus.WAITING && (
          <button className="btn btn-success w-full" onClick={confirmPaid}>
            Подтвердить оплату
          </button>
        )}
        {/* ----- Статус оплачено ----- */}
        {debt.status === DebtStatus.PAID && (
          <p className="text-success font-semibold mt-3">✔ Долг закрыт</p>
        )}
      </div>
    </div>
  );
}
