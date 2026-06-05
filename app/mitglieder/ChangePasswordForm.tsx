"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [message, setMessage] = useState("");

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/member/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      }),
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
    <form onSubmit={handleChangePassword} className="mt-8 rounded-3xl bg-[#f8f5ee] p-6">
      <h2 className="mb-6 text-3xl font-bold text-[#3f6f55]">
        Passwort ändern
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          name="currentPassword"
          type="password"
          placeholder="Aktuelles Passwort"
          className="input-field"
          required
        />

        <input
          name="newPassword"
          type="password"
          placeholder="Neues Passwort"
          className="input-field"
          required
        />
      </div>

      {message && (
        <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-[#3f6f55]">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white"
      >
        Passwort speichern
      </button>
    </form>
  );
}