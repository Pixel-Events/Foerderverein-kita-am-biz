import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const visible = formData.get("visible") === "true";

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Keine Datei ausgewählt." },
        { status: 400 }
      );
    }

    const blob = await put(
      `documents/${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
      }
    );

    const document = await prisma.document.create({
      data: {
        title,
        category,
        fileUrl: blob.url,
        visible,
      },
    });

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error: any) {
    console.error("DOCUMENT CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Dokument konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}