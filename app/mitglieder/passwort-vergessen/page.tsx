"use client";

import { useState } from "react";

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/member/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const result = await response.json();

    setMessage(
      result.message ||
        "Falls ein Mitglied mit dieser E-Mail existiert, wurde eine E-Mail versendet."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-6">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
          Mitgliederbereich
        </p>

        <h1
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-6 text-4xl font-bold text-[#3f6f55]"
        >
          Passwort vergessen
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-[#ddd4c8] px-5 py-4 text-black"
            required
          />

          <button
            type="submit"
            className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
          >
            Link senden
          </button>
        </form>

        {message && (
          <div className="mt-4 rounded-2xl bg-[#f8f5ee] p-4 text-sm text-[#3f6f55]">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}