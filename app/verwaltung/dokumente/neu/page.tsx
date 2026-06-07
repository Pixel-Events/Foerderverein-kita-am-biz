"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NeuesDokumentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const visibleCheckbox = form.elements.namedItem(
      "visible"
    ) as HTMLInputElement;

    formData.set("visible", visibleCheckbox.checked ? "true" : "false");

    const response = await fetch("/api/documents/create", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setMessage(result.message || "Dokument konnte nicht gespeichert werden.");
      return;
    }

    setMessage("Dokument wurde erfolgreich gespeichert.");

    setTimeout(() => {
      router.push("/verwaltung/dokumente");
      router.refresh();
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/verwaltung/dokumente"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55]"
        >
          ← Zurück
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Dokumente
          </p>

          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mt-2 text-5xl font-bold text-[#3f6f55]"
          >
            Neues Dokument
          </h1>

          <form onSubmit={handleUpload} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block font-medium">Titel</label>
              <input
                type="text"
                name="title"
                required
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3"
                placeholder="z. B. Satzung 2026"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Kategorie</label>
              <select
                name="category"
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3"
              >
                <option>Satzung</option>
                <option>Protokoll</option>
                <option>Einladung</option>
                <option>Formular</option>
                <option>Sonstiges</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">Dokument</label>
              <input
                type="file"
                name="file"
                accept=".pdf"
                required
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3"
              />
            </div>

            <label className="flex items-center gap-3">
              <input name="visible" type="checkbox" defaultChecked />
              <span>Für Mitglieder sichtbar</span>
            </label>

            {message && (
              <p className="rounded-2xl bg-[#f8f5ee] p-4 text-sm font-semibold text-[#3f6f55]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945] disabled:opacity-60"
            >
              {loading ? "Wird hochgeladen..." : "Dokument speichern"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}