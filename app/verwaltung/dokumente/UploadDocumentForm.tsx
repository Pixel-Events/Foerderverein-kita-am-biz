"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadDocumentForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Allgemein");
  const [visible, setVisible] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Bitte einen Titel eingeben.");
      return;
    }

    if (!file) {
      setError("Bitte eine Datei auswählen.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("visible", String(visible));
    formData.append("file", file);

    const response = await fetch("/api/documents/create", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(result.message || "Dokument konnte nicht hochgeladen werden.");
      return;
    }

    setTitle("");
    setCategory("Allgemein");
    setVisible(true);
    setFile(null);

    e.currentTarget.reset();

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-bold text-[#3f6f55]">
        Dokument hochladen
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel des Dokuments"
          className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
          required
        />

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kategorie, z. B. Satzung"
          className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
        />

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 md:col-span-2"
          required
        />

        <label className="flex items-center gap-3 rounded-2xl border border-[#ddd4c8] p-4 md:col-span-2">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-5 w-5"
          />
          Im Mitgliederbereich anzeigen
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-full bg-[#3f6f55] px-7 py-3 font-semibold text-white transition hover:bg-[#335945] disabled:opacity-60"
      >
        {loading ? "Wird hochgeladen..." : "Dokument hochladen"}
      </button>
    </form>
  );
}