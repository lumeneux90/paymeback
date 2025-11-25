import { supabase } from "./supabaseClient";
import { Debt } from "./types";

export async function getDebtsFromUser(userId: string): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select(
      `*,
      from_user_data:users!debts_from_user_fkey(id, name),
      to_user_data:users!debts_to_user_fkey(id, name)`
    )
    .eq("from_user", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка получения долгов:", error);
    return [];
  }
  return data || [];
}

export async function getDebtsToUser(userId: string): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select(
      `*,
      from_user_data:users!debts_from_user_fkey(id, name),
      to_user_data:users!debts_to_user_fkey(id, name)`
    )
    .eq("to_user", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка получения долгов:", error);
    return [];
  }
  return data || [];
}

export async function getHiddenDebts(userId: string): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select(
      `*,
      from_user_data:users!debts_from_user_fkey(id, name),
      to_user_data:users!debts_to_user_fkey(id, name)`
    )
    .eq("from_user", userId)
    .eq("status", "hidden")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка получения скрытых долгов:", error);
    return [];
  }
  return data || [];
}
