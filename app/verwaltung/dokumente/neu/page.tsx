import Link from "next/link";

export default function NeuesDokumentPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/verwaltung/dokumente"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55]"
        >
          ← Zurück
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Dokumente
          </p>

          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mt-2 text-5xl font-bold text-[#3f6f55]"
          >
            Neues Dokument
          </h1>

          <form className="mt-8 space-y-6">

            <div>
              <label className="mb-2 block font-medium">
                Titel
              </label>

              <input
                type="text"
                name="title"
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3"
                placeholder="z.B. Satzung 2026"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Kategorie
              </label>

              <select
                name="category"
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3"
              >
                <option>Satzung</option>
                <option>Protokoll</option>
                <option>Einladung</option>
                <option>Formular</option>
                <option>Sonstiges</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Dokument
              </label>

              <input
                type="file"
                accept=".pdf"
                className="w-full rounded-2xl border border-[#d8cfc3] px-4 py-3"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="visible"
                type="checkbox"
                defaultChecked
              />

              <label htmlFor="visible">
                Für Mitglieder sichtbar
              </label>
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
            >
              Dokument speichern
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}