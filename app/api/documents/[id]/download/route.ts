import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        fileUrl: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Dokument wurde nicht gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.redirect(document.fileUrl);
  } catch (error) {
    console.error("DOCUMENT DOWNLOAD REDIRECT ERROR:", error);

    return NextResponse.json(
      { message: "Dokument konnte nicht geöffnet werden." },
      { status: 500 }
    );
  }
}