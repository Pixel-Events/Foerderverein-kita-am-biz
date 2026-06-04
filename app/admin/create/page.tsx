"use client";

import { useState } from "react";

export default function CreateAdminPage() {
  const [message, setMessage] = useState("");
  

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget;

  setMessage("");

  const formData = new FormData(form);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    secret: formData.get("secret"),
  };

  const response = await fetch("/api/admin/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    setMessage(result.message || "Fehler beim Erstellen.");
    return;
  }

  setMessage("Admin wurde erfolgreich erstellt.");
  form.reset();
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ee] px-6">
      <form
        onSubmit={handleCreate}
        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
          Admin erstellen
        </p>

        <h1
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-6 text-4xl font-bold text-[#3f6f55]"
        >
          Neuer Admin
        </h1>

        <input
          name="name"
          placeholder="Name"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="E-Mail"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Neues Admin-Passwort"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
          required
        />

        <input
          name="secret"
          type="password"
          placeholder="Einmaliges Setup-Passwort aus .env"
          className="mb-4 w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
          required
        />

        {message && (
          <p className="mb-4 rounded-2xl bg-[#eaf2ea] p-4 text-sm text-[#3f6f55]">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white"
        >
          Admin anlegen
        </button>
      </form>
    </main>
  );
}