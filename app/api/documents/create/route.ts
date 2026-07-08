import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "Allgemein").trim();
    const visible = formData.get("visible") === "true";
    const file = formData.get("file");

    if (!title) {
      return NextResponse.json(
        { message: "Bitte einen Titel angeben." },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Keine Datei ausgewählt." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Die Datei darf maximal 10 MB groß sein." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message: "Nur PDF, JPG, PNG oder Word-Dokumente sind erlaubt.",
        },
        { status: 400 }
      );
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const blob = await put(
      `documents/${Date.now()}-${safeFileName}`,
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
        message: error?.message || "Dokument konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}