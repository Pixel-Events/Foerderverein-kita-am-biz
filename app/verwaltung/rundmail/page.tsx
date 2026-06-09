"use client";

import Link from "next/link";
import { useState } from "react";

export default function RundmailPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setStatusMessage("");

    const response = await fetch("/api/rundmail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, message }),
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok) {
      setStatusMessage(result.message || "Rundmail konnte nicht versendet werden.");
      return;
    }

    setStatusMessage(`Rundmail wurde an ${result.count} Mitglieder versendet.`);
    setSubject("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/verwaltung"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55]"
        >
          ← Zurück zur Verwaltung
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Verwaltung
          </p>

          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mt-2 text-5xl font-bold text-[#3f6f55]"
          >
            Rundmail senden
          </h1>

          <p className="mt-4 text-[#666]">
            Senden Sie eine Nachricht an alle aktiven Mitglieder des Fördervereins.
          </p>

          <form onSubmit={handleSend} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block font-semibold text-[#3f6f55]">
                Betreff
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3 text-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#3f6f55]">
                Nachricht
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3 text-black"
                required
              />
            </div>

            {statusMessage && (
              <p className="rounded-2xl bg-[#f8f5ee] p-4 text-sm font-semibold text-[#3f6f55]">
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945] disabled:opacity-60"
            >
              {loading ? "Wird gesendet..." : "Rundmail senden"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}