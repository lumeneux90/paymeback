"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

function usernameToEmail(name: string) {
  const clean = name.toLowerCase().replace(/\s+/g, "_");
  return `${clean}@pmb.app`;
}

function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [generatedPin, setGeneratedPin] = useState("");
  const [step, setStep] = useState<"name" | "login-pin" | "register-show-pin">(
    "name"
  );

  async function checkUserExists(email: string) {
    const { data, error } = await supabase.rpc("find_auth_user", { email });

    if (error) {
      console.error(error);
      return false;
    }

    return data === true;
  }

  async function handleName() {
    if (!name.trim()) return;

    const email = usernameToEmail(name.trim());
    const exists = await checkUserExists(email);

    if (exists) {
      setStep("login-pin");
      return;
    }

    // Новый пользователь — генерируем PIN
    const newPin = generatePin();
    setGeneratedPin(newPin);
    setStep("register-show-pin");
  }

  async function handleRegister() {
    const email = usernameToEmail(name.trim());

    const { data, error } = await supabase.auth.signUp({
      email,
      password: generatedPin,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const authUser = data.user;

    if (!authUser) return;

    await supabase.from("users").insert({
      id: authUser.id,
      name: name.trim(),
    });

    router.replace("/my-debt");
  }

  async function handleLoginPin() {
    const email = usernameToEmail(name.trim());

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    });

    if (error) {
      alert("Неверный PIN");
      return;
    }

    router.replace("/my-debt");
  }

  // UI
  if (step === "name") {
    return (
      <div className="max-w-xs mx-auto mt-20">
        <input
          className="input input-bordered w-full mb-4"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary w-full" onClick={handleName}>
          Далее
        </button>
      </div>
    );
  }

  if (step === "login-pin") {
    return (
      <div className="max-w-xs mx-auto mt-20">
        <p className="mb-2">
          Введите PIN для <b>{name}</b>
        </p>
        <input
          className="input input-bordered w-full mb-4"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button className="btn btn-primary w-full" onClick={handleLoginPin}>
          Войти
        </button>
      </div>
    );
  }

  if (step === "register-show-pin") {
    return (
      <div className="max-w-xs mx-auto mt-20 text-center">
        <p className="text-lg font-semibold">Ваш PIN:</p>
        <p className="text-4xl font-bold tracking-widest my-4">
          {generatedPin}
        </p>
        <button className="btn btn-success w-full" onClick={handleRegister}>
          Создать аккаунт
        </button>
      </div>
    );
  }

  return null;
}
