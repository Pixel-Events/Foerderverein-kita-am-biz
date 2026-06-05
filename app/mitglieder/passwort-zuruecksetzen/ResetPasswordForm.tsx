"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswortZuruecksetzenPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    const response = await fetch("/api/member/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setIsError(true);
      setMessage(result.message || "Passwort konnte nicht geändert werden.");
      return;
    }

    setMessage("Passwort wurde erfolgreich geändert.");

    setTimeout(() => {
      router.push("/mitglieder/login");
    }, 1500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
          Mitgliederbereich
        </p>

        <h1
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-6 text-4xl font-bold text-[#3f6f55]"
        >
          Neues Passwort
        </h1>

        <input
          type="password"
          placeholder="Neues Passwort"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        <input
          type="password"
          placeholder="Passwort wiederholen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        {message && (
          <p
            className={`mb-4 rounded-2xl p-4 text-sm ${
              isError
                ? "bg-red-50 text-red-700"
                : "bg-[#eaf2ea] text-[#3f6f55]"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
        >
          Passwort speichern
        </button>
      </form>
    </main>
  );
}