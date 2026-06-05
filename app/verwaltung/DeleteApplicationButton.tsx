"use client";

export default function DeleteApplicationButton({
  id,
}: {
  id: string;
}) {
  async function handleDelete() {
    const confirmed = confirm(
      "Diesen Antrag wirklich löschen?"
    );

    if (!confirmed) return;

    const response = await fetch(
      `/api/membership/${id}/delete`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Antrag konnte nicht gelöscht werden.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
    >
      Löschen
    </button>
  );
}