"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/lib/users";
import { supabase } from "@/lib/supabaseClient";
import { DebtStatus, Tags } from "@/lib/enums";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function CreateDebtPage() {
  const TAGS = Object.values(Tags);

  const [users, setUsers] = useState<User[]>([]);
  const [friendId, setFriendId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<Tags | undefined>();

  const { user } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      if (!user) {
        return;
      }
      const data = await getUsers();

      // исключаем самого себя
      setUsers(data.filter((u) => u.id !== user.id));
    }

    load();
  }, [user]);

  const createDebt = async () => {
    if (!friendId || !amount || !user) return;

    const { error } = await supabase.from("debts").insert([
      {
        from_user: user.id,
        to_user: friendId,
        amount: Number(amount),
        description,
        tag,
        status: DebtStatus.PENDING,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Ошибка при создании долга");
      return;
    }

    router.replace("/my-debt");
  };

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
      <legend className="fieldset-legend text-lg">Создать чек</legend>

      {/* Друг */}

      <label className="label">Кто?</label>
      <select
        className="select select-bordered"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
      >
        <option value="">Выберите друга</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* Сумма */}
      <label className="label">Сумма</label>
      <input
        type="number"
        className="input input-bordered"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Например, 500"
      />

      {/* Тег */}
      <form className="filter">
        {TAGS.map((t) => (
          <input
            key={t}
            className="btn btn-accent btn-sm my-0.5"
            type="checkbox"
            name="status"
            aria-label={t}
            value={t}
            onChange={(e) => setTag(e.target.value as Tags)}
          />
        ))}

        <input className="btn btn-sm my-0.5" type="reset" value="×" />
      </form>

      {/* Описание */}
      <label className="label">Описание (опционально)</label>
      <input
        type="text"
        className="input input-bordered"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="За что должен?"
      />

      {/* Создать */}
      <button className="btn btn-primary mt-4" onClick={createDebt}>
        Создать чек
      </button>
    </fieldset>
  );
}
