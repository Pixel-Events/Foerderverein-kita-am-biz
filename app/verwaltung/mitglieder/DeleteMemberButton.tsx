"use client";

export default function DeleteMemberButton({ id }: { id: string }) {
  async function deleteMember() {
    const confirmed = confirm(
      "Dieses Mitglied wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
    );

    if (!confirmed) return;

    const response = await fetch(`/api/membership/${id}/delete`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Mitglied konnte nicht gelöscht werden.");
      return;
    }

    alert("Mitglied wurde gelöscht.");
    window.location.href = "/verwaltung/mitglieder";
  }

  return (
    <button
      type="button"
      onClick={deleteMember}
      className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
    >
      Löschen
    </button>
  );
}