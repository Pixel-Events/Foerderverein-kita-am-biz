import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DokumentePage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-5xl">
        <Link href="/verwaltung" className="text-[#3f6f55]">
          ← Zurück zur Verwaltung
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">
          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-4 text-4xl font-bold text-[#3f6f55]"
          >
            Dokumente
          </h1>

          <p className="mb-8 text-[#555]">
            Hier können Vereinsdokumente, Satzung, Datenschutzunterlagen und
            weitere Vorlagen gesammelt werden.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <a
              href="/satzung.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[#ddd4c8] bg-[#f8f5ee] p-5 transition hover:border-[#3f6f55] hover:bg-white"
            >
              <h2 className="text-xl font-bold text-[#3f6f55]">Satzung</h2>
              <p className="mt-2 text-sm text-[#555]">
                Satzung des Fördervereins Kita am BiZ e. V. öffnen.
              </p>
            </a>

            <a
              href="/datenschutzhinweise.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[#ddd4c8] bg-[#f8f5ee] p-5 transition hover:border-[#3f6f55] hover:bg-white"
            >
              <h2 className="text-xl font-bold text-[#3f6f55]">
                Datenschutzhinweise
              </h2>
              <p className="mt-2 text-sm text-[#555]">
                Datenschutzhinweise nach Art. 13 DSGVO öffnen.
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}