"use client";

import {
  EyeClosedIcon,
  TrashIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { Debt } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { colorLine } from "@/lib/constants";
import { useSession } from "./session-provider";
import { useRouter } from "next/navigation";

export default function DebtCard({ debt }: { debt: Debt }) {
  const router = useRouter();

  const hideDebt = async () => {
    await supabase.from("debts").update({ status: "hidden" }).eq("id", debt.id);

    router.refresh();
  };

  const deleteDebt = async () => {
    await supabase.from("debts").delete().eq("id", debt.id);

    router.refresh();
  };

  const session = useSession();

  return (
    <div className="card bg-base-200 shadow-md relative">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${colorLine[debt.status]}`}
      ></div>

      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg">{debt.amount} ₽</h2>
          <span className="badge badge-secondary font-semibold">
            {session?.user.id === debt.from_user
              ? debt.to_user_data?.name
              : debt.from_user_data?.name}
          </span>
        </div>
        {debt.tag && <span className="badge badge-neutral">{debt.tag}</span>}

        <p className="text-sm opacity-70">{debt.description}</p>
        <p className="text-xs opacity-50 mt-1">
          {new Date(debt.created_at).toLocaleDateString()}
        </p>

        <div className="flex gap-2 mt-3">
          <button className="btn btn-sm btn-outline" onClick={hideDebt}>
            <EyeClosedIcon /> Скрыть
          </button>

          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={deleteDebt}
          >
            <TrashIcon /> Удалить
          </button>

          {debt.sbp_link && (
            <a
              href={debt.sbp_link}
              target="_blank"
              className="btn btn-sm btn-primary"
            >
              <ExternalLinkIcon /> Оплатить
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
