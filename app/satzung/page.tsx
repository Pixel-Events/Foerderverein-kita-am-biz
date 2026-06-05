import Link from "next/link";

export default function SatzungPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-16 text-[#2f2f2f]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55] shadow-sm transition hover:border-[#3f6f55]"
        >
          ← Zur Startseite
        </Link>

        <div className="rounded-[36px] bg-white p-8 shadow-xl md:p-12">
          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-6 text-5xl font-bold text-[#3f6f55]"
          >
            Satzung
          </h1>

          <p className="mb-8 text-lg text-[#555]">
            Hier können Sie die aktuelle Satzung des Fördervereins Kita am BiZ e. V.
            einsehen oder herunterladen.
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <a
              href="/dokumente/satzung.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white transition hover:bg-[#335945]"
            >
              Satzung öffnen
            </a>

            <a
              href="/dokumente/satzung.pdf"
              download
              className="rounded-full border border-[#3f6f55] px-6 py-3 font-semibold text-[#3f6f55] transition hover:bg-[#f8f5ee]"
            >
              Satzung herunterladen
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#ece6dc]">
            <iframe
              src="/dokumente/satzung.pdf"
              className="h-[900px] w-full"
            />
          </div>
        </div>
      </div>
    </main>
  );
}