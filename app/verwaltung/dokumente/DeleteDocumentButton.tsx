"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteDocumentButton({ id }: { id: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/documents/${id}/delete`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(result.message || "Dokument konnte nicht gelöscht werden.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        Löschen
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
              Dokument löschen
            </p>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-4 text-4xl font-bold text-[#3f6f55]"
            >
              Wirklich löschen?
            </h2>

            <p className="mb-6 leading-7 text-[#555]">
              Dieses Dokument wird aus der Verwaltung entfernt.
            </p>

            {error && (
              <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 rounded-full border border-[#ddd4c8] px-6 py-4 font-semibold text-[#555]"
              >
                Abbrechen
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-full bg-red-600 px-6 py-4 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Wird gelöscht..." : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}