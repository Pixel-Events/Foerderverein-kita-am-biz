"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswortAendernPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const response = await fetch(
      "/api/member/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
          confirmPassword,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.message);
      return;
    }

    setSuccess("Passwort erfolgreich geändert.");

    setTimeout(() => {
      router.push("/mitglieder");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
          Erster Login
        </p>

        <h1
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-6 text-4xl font-bold text-[#3f6f55]"
        >
          Passwort festlegen
        </h1>

        <p className="mb-6 text-sm text-[#666]">
          Bitte vergeben Sie ein eigenes Passwort für Ihren Mitgliederzugang.
        </p>

        <input
          type="password"
          placeholder="Neues Passwort"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
          required
        />

        <input
          type="password"
          placeholder="Passwort wiederholen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
          required
        />

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
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