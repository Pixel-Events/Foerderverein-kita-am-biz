"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteDocumentButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Dokument wirklich löschen?");

    if (!confirmed) return;

    setLoading(true);

    const response = await fetch(`/api/documents/${id}/delete`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!response.ok) {
      alert("Dokument konnte nicht gelöscht werden.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-60"
    >
      {loading ? "..." : "Löschen"}
    </button>
  );
}