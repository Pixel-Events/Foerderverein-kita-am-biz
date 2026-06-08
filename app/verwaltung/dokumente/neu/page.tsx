import Link from "next/link";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function DokumentePage() {
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/verwaltung"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55]"
        >
          ← Zurück zur Verwaltung
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
                Verwaltung
              </p>

              <h1
                style={{ fontFamily: "var(--font-baloo)" }}
                className="mt-2 text-5xl font-bold text-[#3f6f55]"
              >
                Dokumente
              </h1>
            </div>

            <Link
              href="/verwaltung/dokumente/neu"
              className="rounded-full bg-[#3f6f55] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#335945]"
            >
              + Dokument
            </Link>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-[#ece6dc] text-black">
            <table className="w-full text-left">
              <thead className="bg-[#eaf2ea] text-[#3f6f55]">
                <tr>
                  <th className="p-4">Titel</th>
                  <th className="p-4">Kategorie</th>
                  <th className="p-4">Sichtbar</th>
                  <th className="p-4">Datum</th>
                  <th className="p-4">Aktion</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="border-t border-[#ece6dc]"
                  >
                    <td className="p-4 font-semibold">
                      {document.title}
                    </td>

                    <td className="p-4">
                      {document.category}
                    </td>

                    <td className="p-4">
                      {document.visible ? "Ja" : "Nein"}
                    </td>

                    <td className="p-4">
                      {new Date(document.createdAt).toLocaleDateString(
                        "de-DE"
                      )}
                    </td>

                    <td className="p-4">
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#3f6f55] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Öffnen
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {documents.length === 0 && (
              <div className="p-8 text-center text-[#666]">
                Noch keine Dokumente vorhanden.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}