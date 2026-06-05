"use client";

export default function DeleteDonationButton({ id }: { id: string }) {
  async function handleDelete() {
    const confirmed = confirm("Diese Spende wirklich löschen?");
    if (!confirmed) return;

    const response = await fetch(`/api/donation/${id}/delete`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Spende konnte nicht gelöscht werden.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
    >
      Löschen
    </button>
  );
}