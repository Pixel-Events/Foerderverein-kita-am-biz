"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveMemberButton({ id }: { id: string }) {
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function approveMember() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/membership/${id}/approve`, {
      method: "POST",
    });

    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(result.message || "Mitglied konnte nicht übernommen werden.");
      return;
    }

    setShowConfirmModal(false);

    router.push("/verwaltung/mitglieder");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirmModal(true)}
        className="rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
      >
        ✓ Als Mitglied übernehmen
      </button>

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

            <p className="mb-6 leading-8 text-[#555]">
              Der Antragsteller wird als Mitglied übernommen.
              <br />
              Es wird automatisch eine Mitgliedsnummer vergeben, ein
              Initialpasswort erstellt und eine Willkommens-E-Mail versendet.
            </p>

            {error && (
              <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 rounded-full border border-[#ddd4c8] px-6 py-4 font-semibold text-[#555]"
              >
                Abbrechen
              </button>

              <button
                type="button"
                onClick={approveMember}
                disabled={loading}
                className="flex-1 rounded-full bg-[#3f6f55] px-6 py-4 font-semibold text-white transition hover:bg-[#335945] disabled:opacity-60"
              >
                {loading ? "Wird übernommen..." : "Ja, übernehmen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}