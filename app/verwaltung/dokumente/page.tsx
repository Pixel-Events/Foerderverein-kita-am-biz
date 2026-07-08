import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import UploadDocumentForm from "./UploadDocumentForm";
import DeleteDocumentButton from "./DeleteDocumentButton";

export const dynamic = "force-dynamic";

export default async function VerwaltungDokumentePage() {
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-6xl">
        <Link href="/verwaltung" className="text-[#3f6f55]">
          ← Zurück zur Verwaltung
        </Link>

        <div className="mt-8">
          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-3 text-4xl font-bold text-[#3f6f55] md:text-5xl"
          >
            Dokumente
          </h1>

          <p className="mb-8 text-lg text-[#555]">
            Hier kannst du Dokumente hochladen, die im Mitgliederbereich
            angezeigt werden können.
          </p>

          <UploadDocumentForm />

          <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-[#3f6f55]">
              Hochgeladene Dokumente
            </h2>

            {documents.length === 0 ? (
              <p className="text-[#555]">Noch keine Dokumente vorhanden.</p>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#ece6dc] bg-[#f8f5ee] p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-[#3f6f55]">
                        {document.title}
                      </h3>

                      <p className="mt-1 text-sm text-[#666]">
                        Kategorie: {document.category || "Allgemein"} ·{" "}
                        {new Date(document.createdAt).toLocaleDateString(
                          "de-DE"
                        )}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#3f6f55]">
                        Im Mitgliederbereich sichtbar:{" "}
                        {document.visible ? "Ja" : "Nein"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#3f6f55] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#335945]"
                      >
                        Öffnen
                      </a>

                      <DeleteDocumentButton id={document.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}