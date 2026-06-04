"use client";

import { useRouter } from "next/navigation";

export default function ApproveMemberButton({ id }: { id: string }) {
  const router = useRouter();

  async function approveMember() {
    const confirmed = confirm(
      "Diesen Antrag als Mitglied übernehmen?"
    );

    if (!confirmed) return;

    const response = await fetch(`/api/membership/${id}/approve`, {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Mitglied konnte nicht erstellt werden.");
      return;
    }

    alert("Mitglied wurde erfolgreich angelegt.");
    router.refresh();
  }

  return (
    <button
      onClick={approveMember}
      className="rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white transition hover:bg-[#335945]"
    >
      Als Mitglied übernehmen
    </button>
  );
}