import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function MitgliederDokumentePage() {
  const documents = await prisma.document.findMany({
    where: {
      visible: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-5xl">
        <Link href="/mitglieder" className="text-[#3f6f55]">
          ← Zurück zum Mitgliederbereich
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">
          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-3 text-4xl font-bold text-[#3f6f55] md:text-5xl"
          >
            Dokumente
          </h1>

          <p className="mb-8 text-[#555]">
            Hier findest du wichtige Dokumente des Fördervereins.
          </p>

          {documents.length === 0 ? (
            <p className="rounded-2xl bg-[#f8f5ee] p-5 text-[#555]">
              Aktuell sind keine Dokumente verfügbar.
            </p>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <a
                  key={document.id}
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#ece6dc] bg-[#f8f5ee] p-5 transition hover:border-[#3f6f55] hover:bg-white"
                >
                  <h2 className="text-xl font-bold text-[#3f6f55]">
                    {document.title}
                  </h2>

                  <p className="mt-2 text-sm text-[#666]">
                    Kategorie: {document.category || "Allgemein"} ·{" "}
                    {new Date(document.createdAt).toLocaleDateString("de-DE")}
                  </p>

                  <p className="mt-3 inline-flex rounded-full bg-[#3f6f55] px-4 py-2 text-sm font-semibold text-white">
                    Dokument öffnen
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}