"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Login fehlgeschlagen.");
      return;
    }

    router.push("/verwaltung");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
          Adminbereich
        </p>

        <h1
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-6 text-4xl font-bold text-[#3f6f55]"
        >
          Verwaltung Login
        </h1>

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
        >
          Einloggen
        </button>
      </form>
    </main>
  );
}