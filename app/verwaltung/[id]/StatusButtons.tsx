"use client";

import { useRouter } from "next/navigation";

export default function StatusButtons({ id }: { id: string }) {
  const router = useRouter();

  async function updateStatus(status: string) {
    const response = await fetch(`/api/membership/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      alert("Status konnte nicht geändert werden.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <button
        onClick={() => updateStatus("Abgelehnt")}
        className="rounded-full bg-red-100 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-200"
      >
        ✕ Ablehnen
      </button>
    </div>
  );
}