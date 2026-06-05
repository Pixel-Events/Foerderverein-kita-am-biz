"use client";

import { useRouter } from "next/navigation";

export default function MarkReceiptButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  async function handleClick() {
    const response = await fetch(
      `/api/donation/${id}/receipt`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      alert("Status konnte nicht geändert werden.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-[#3f6f55] px-3 py-2 text-sm font-semibold text-white hover:bg-[#335945]"
    >
      ✓ Quittung erstellt
    </button>
  );
}