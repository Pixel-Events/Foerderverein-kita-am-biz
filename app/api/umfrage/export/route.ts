import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

function escapeCsv(value: string | number | null | undefined) {
  const text = String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  try {
    const responses = await prisma.surveyResponse.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const header = [
      "Datum",
      "Sprache",
      "Name",
      "Bewertung",
      "Was hat dir besonders gut gefallen?",
      "Was können wir in Zukunft ändern, damit dein Gesamteindruck sich verbessert?",
    ];

    const rows = responses.map((response) => [
      formatDate(response.createdAt),
      getLanguageLabel(response.language),
      response.name || "Anonym",
      response.rating,
      response.answerOne,
      response.answerTwo,
    ]);

    const csvContent = [
      header.map(escapeCsv).join(";"),
      ...rows.map((row) => row.map(escapeCsv).join(";")),
    ].join("\n");

    const csvWithBom = "\uFEFF" + csvContent;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="umfrage-auswertung.csv"`,
      },
    });
  } catch (error) {
    console.error("UMFRAGE CSV EXPORT ERROR:", error);

    return NextResponse.json(
      { message: "CSV-Export konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}