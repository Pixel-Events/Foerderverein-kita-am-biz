"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContributionButton({
  memberId,
  contributionPaidYear,
}: {
  memberId: string;
  contributionPaidYear?: number | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const isPaid = contributionPaidYear === currentYear;

  async function toggleContribution() {
    setLoading(true);

    const response = await fetch(`/api/member/${memberId}/contribution`, {
      method: "PATCH",
    });

    setLoading(false);

    if (!response.ok) {
      alert("Beitragsstatus konnte nicht geändert werden.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggleContribution}
      disabled={loading}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        isPaid
          ? "bg-[#eaf2ea] text-[#3f6f55] hover:bg-[#dcebdc]"
          : "bg-[#fff3d8] text-[#9a6a00] hover:bg-[#ffe9ad]"
      }`}
    >
      {loading ? "..." : isPaid ? "Bezahlt" : "Noch ausstehend"}
    </button>
  );
}