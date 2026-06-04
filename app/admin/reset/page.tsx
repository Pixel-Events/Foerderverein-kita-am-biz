"use client";

import { useState } from "react";

export default function ResetAdminPasswordPage() {
  const [message, setMessage] = useState("");

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    setMessage("");

    const formData = new FormData(form);

    const data = {
      email: formData.get("email"),
      newPassword: formData.get("newPassword"),
      secret: formData.get("secret"),
    };

    const response = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message || "Passwort konnte nicht geändert werden.");
      return;
    }

    setMessage("Passwort wurde erfolgreich geändert.");

    form.reset();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-6">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
          Adminbereich
        </p>

        <h1
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-6 text-4xl font-bold text-[#3f6f55]"
        >
          Passwort zurücksetzen
        </h1>

        <input
          name="email"
          type="email"
          placeholder="Admin-E-Mail"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        <input
          name="newPassword"
          type="password"
          placeholder="Neues Passwort"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        <input
          name="secret"
          type="password"
          placeholder="Setup-Passwort aus .env"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
          required
        />

        {message && (
          <p className="mb-4 rounded-2xl bg-[#eaf2ea] p-4 text-sm text-[#3f6f55]">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
        >
          Passwort ändern
        </button>
      </form>
    </main>
  );
}