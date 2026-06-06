"use client";

import { useRouter } from "next/navigation";

const [showConfirmModal, setShowConfirmModal] = useState(false);

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

    {showConfirmModal && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf2ea] text-3xl">
            👤
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Mitglied übernehmen
          </p>

          <h2
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-4 text-4xl font-bold text-[#3f6f55]"
          >
            Mitglied aufnehmen?
          </h2>

          <p className="mb-8 leading-8 text-[#555]">
            Der Antragsteller wird als Mitglied übernommen.
            <br /><br />
            Es wird automatisch:
            <br />
            • ein Mitglied angelegt
            <br />
            • eine Mitgliedsnummer vergeben
            <br />
            • ein Initialpasswort erzeugt
            <br />
            • eine Willkommens-E-Mail versendet
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 rounded-full border border-[#ddd4c8] px-6 py-4 font-semibold text-[#555]"
            >
              Abbrechen
            </button>

            <button
              onClick={async () => {
                setShowConfirmModal(false);
                await approveMember();
              }}
              className="flex-1 rounded-full bg-[#3f6f55] px-6 py-4 font-semibold text-white transition hover:bg-[#335945]"
            >
              Ja, übernehmen
            </button>
          </div>
        </div>
      </div>
    )}

  return (
    <button
      onClick={() => setShowConfirmModal(true)}
      className="rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
      >
      ✓ Als Mitglied übernehmen
    </button>
  );
}