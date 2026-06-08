import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, { params }: RouteContext) {
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

    try {
      await del(document.fileUrl);
    } catch (blobError) {
      console.error("BLOB DELETE ERROR:", blobError);
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Dokument wurde gelöscht.",
    });
  } catch (error: any) {
    console.error("DOCUMENT DELETE ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Dokument konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}