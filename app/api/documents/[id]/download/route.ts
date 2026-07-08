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
    });

    if (!document) {
      return NextResponse.json(
        { message: "Dokument wurde nicht gefunden." },
        { status: 404 }
      );
    }

    return new NextResponse(Buffer.from(document.data), {
      status: 200,
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(
          document.fileName
        )}"`,
      },
    });
  } catch (error) {
    console.error("DOCUMENT DOWNLOAD ERROR:", error);

    return NextResponse.json(
      { message: "Dokument konnte nicht geöffnet werden." },
      { status: 500 }
    );
  }
}