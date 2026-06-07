import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export default async function DokumentePage() {
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/verwaltung"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55]"
        >
          ← Zurück
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
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
              className="rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white"
            >
              + Dokument
            </Link>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-[#ece6dc]">
            <table className="w-full">
              <thead className="bg-[#f8f5ee]">
                <tr>
                  <th className="p-4 text-left">Titel</th>
                  <th className="p-4 text-left">Kategorie</th>
                  <th className="p-4 text-left">Sichtbar</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="border-t border-[#ece6dc]"
                  >
                    <td className="p-4">
                      {document.title}
                    </td>

                    <td className="p-4">
                      {document.category}
                    </td>

                    <td className="p-4">
                      {document.visible ? "Ja" : "Nein"}
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