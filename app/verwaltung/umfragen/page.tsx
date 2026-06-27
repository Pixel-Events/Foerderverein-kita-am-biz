import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SearchParams = {
  sprache?: string;
  sortierung?: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getLanguageLabel(language: string) {
  const labels: Record<string, string> = {
    de: "Deutsch",
    en: "Englisch",
    tr: "Türkisch",
    ar: "Arabisch",
    uk: "Ukrainisch",
  };

  return labels[language] || language;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function buildFilterLink({
  sprache,
  sortierung,
}: {
  sprache?: string;
  sortierung?: string;
}) {
  const params = new URLSearchParams();

  if (sprache && sprache !== "alle") {
    params.set("sprache", sprache);
  }

  if (sortierung && sortierung !== "neueste") {
    params.set("sortierung", sortierung);
  }

  const query = params.toString();

  return query ? `/verwaltung/umfragen?${query}` : "/verwaltung/umfragen";
}

export default async function UmfragenAuswertungPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const selectedLanguage = params.sprache || "alle";
  const selectedSort = params.sortierung || "neueste";

  const orderBy =
    selectedSort === "aelteste"
      ? { createdAt: "asc" as const }
      : selectedSort === "beste"
        ? { rating: "desc" as const }
        : selectedSort === "schlechteste"
          ? { rating: "asc" as const }
          : { createdAt: "desc" as const };

  const responses = await prisma.surveyResponse.findMany({
    where:
      selectedLanguage !== "alle"
        ? {
            language: selectedLanguage,
          }
        : undefined,
    orderBy,
  });

  const allResponses = await prisma.surveyResponse.findMany();

  const total = responses.length;
  const totalAll = allResponses.length;

  const average =
    total > 0
      ? responses.reduce((sum, item) => sum + item.rating, 0) / total
      : 0;

  const averageAll =
    totalAll > 0
      ? allResponses.reduce((sum, item) => sum + item.rating, 0) / totalAll
      : 0;

  const languageOptions = [
    { value: "alle", label: "Alle Sprachen" },
    { value: "de", label: "Deutsch" },
    { value: "en", label: "Englisch" },
    { value: "tr", label: "Türkisch" },
    { value: "ar", label: "Arabisch" },
    { value: "uk", label: "Ukrainisch" },
  ];

  const sortOptions = [
    { value: "neueste", label: "Neueste zuerst" },
    { value: "aelteste", label: "Älteste zuerst" },
    { value: "beste", label: "Beste Bewertung zuerst" },
    { value: "schlechteste", label: "Niedrigste Bewertung zuerst" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              style={{ fontFamily: "var(--font-baloo)" }}
              className="text-4xl font-bold text-[#3f6f5a] md:text-5xl"
            >
              Umfrage-Auswertung
            </h1>

            <p className="mt-3 text-lg text-[#555]">
              Übersicht aller abgegebenen Bewertungen.
            </p>
          </div>

          <Link
            href="/verwaltung"
            className="rounded-full border border-[#dacbbb] bg-white px-5 py-3 font-semibold text-[#3f6f5a] transition hover:bg-[#f8f5ee]"
          >
            Zurück zur Verwaltung
          </Link>
        </div>

        <section className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#777]">
              Teilnahmen gefiltert
            </p>
            <p className="mt-3 text-4xl font-bold text-[#3f6f5a]">{total}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#777]">
              Teilnahmen gesamt
            </p>
            <p className="mt-3 text-4xl font-bold text-[#3f6f5a]">{totalAll}</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#777]">
              Durchschnitt gefiltert
            </p>
            <p className="mt-3 text-4xl font-bold text-[#3f6f5a]">
              {average.toFixed(1)} / 5
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#777]">
              Durchschnitt gesamt
            </p>
            <p className="mt-3 text-4xl font-bold text-[#3f6f5a]">
              {averageAll.toFixed(1)} / 5
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-3 font-semibold text-[#333]">Sprache filtern</p>

              <div className="flex flex-wrap gap-2">
                {languageOptions.map((option) => {
                  const isActive = selectedLanguage === option.value;

                  return (
                    <Link
                      key={option.value}
                      href={buildFilterLink({
                        sprache: option.value,
                        sortierung: selectedSort,
                      })}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#3f6f5a] text-white"
                          : "border border-[#dacbbb] bg-[#fffdf9] text-[#3f6f5a] hover:bg-[#f8f5ee]"
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 font-semibold text-[#333]">Sortierung</p>

              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const isActive = selectedSort === option.value;

                  return (
                    <Link
                      key={option.value}
                      href={buildFilterLink({
                        sprache: selectedLanguage,
                        sortierung: option.value,
                      })}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#3f6f5a] text-white"
                          : "border border-[#dacbbb] bg-[#fffdf9] text-[#3f6f5a] hover:bg-[#f8f5ee]"
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {responses.length === 0 ? (
          <section className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-[#555]">
              Für diesen Filter wurden noch keine Bewertungen abgegeben.
            </p>
          </section>
        ) : (
          <section className="space-y-5">
            {responses.map((response) => (
              <article
                key={response.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8"
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2">
                      <Stars rating={response.rating} />
                    </div>

                    <p className="text-sm text-[#666]">
                      {formatDate(response.createdAt)} ·{" "}
                      {getLanguageLabel(response.language)}
                    </p>
                  </div>

                  <div className="rounded-full bg-[#f8f5ee] px-4 py-2 text-sm font-semibold text-[#3f6f5a]">
                    {response.name ? response.name : "Anonym"}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-5">
                    <h2 className="mb-3 font-semibold text-[#3f6f5a]">
                      Was können wir verbessern?
                    </h2>

                    <p className="whitespace-pre-wrap leading-7 text-[#333]">
                      {response.answerOne}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-5">
                    <h2 className="mb-3 font-semibold text-[#3f6f5a]">
                      Was hat besonders gut gefallen?
                    </h2>

                    <p className="whitespace-pre-wrap leading-7 text-[#333]">
                      {response.answerTwo}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}