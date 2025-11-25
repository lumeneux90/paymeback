import { supabase } from "./supabaseClient";
import { Session, User } from "./types";

const STORAGE_USER = "pmb_user";
const STORAGE_TOKEN = "pmb_token";

export function saveSession(user: User, token: string) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_TOKEN, token);
}

export function getSession(): Session {
  const userRaw = localStorage.getItem(STORAGE_USER);
  const token = localStorage.getItem(STORAGE_TOKEN);

  if (!userRaw || !token) return null;

  return {
    user: JSON.parse(userRaw) as User,
    token,
  };
}

export function logout() {
  localStorage.removeItem(STORAGE_USER);
  localStorage.removeItem(STORAGE_TOKEN);
}

export async function loginByName(name: string) {
  // 1. пробуем найти юзера
  const { data: exist } = await supabase
    .from("users")
    .select("*")
    .eq("name", name)
    .single();

  if (exist) {
    saveSession(exist, exist.id);
    return exist;
  }

  // 2. если нет — создаём
  const { data: user } = await supabase
    .from("users")
    .insert([{ name }])
    .select()
    .single();

  saveSession(user!, user!.id);
  return user!;
}
