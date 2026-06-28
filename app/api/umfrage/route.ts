import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const language = String(body.language || "").trim();
    const name = String(body.name || "").trim();
    const rating = Number(body.rating);
    const answerOne = String(body.answerOne || "").trim();
    const answerTwo = String(body.answerTwo || "").trim();

    if (!language || !rating || !answerOne || !answerTwo) {
      return NextResponse.json(
        {
          error: "Bitte alle Pflichtfelder ausfüllen.",
          debug: {
            language,
            rating,
            answerOneVorhanden: Boolean(answerOne),
            answerTwoVorhanden: Boolean(answerTwo),
          },
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Die Bewertung muss zwischen 1 und 5 Sternen liegen." },
        { status: 400 }
      );
    }

    await prisma.surveyResponse.create({
      data: {
        language,
        name: name || null,
        rating,
        answerOne,
        answerTwo,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Speichern der Umfrage:", error);

    return NextResponse.json(
      { error: "Die Umfrage konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}