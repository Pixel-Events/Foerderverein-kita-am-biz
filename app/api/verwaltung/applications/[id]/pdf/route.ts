import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const application = await prisma.membershipApplication.findUnique({
      where: { id },
      select: {
        pdfFileName: true,
        pdfMimeType: true,
        pdfData: true,
      },
    });

    if (!application || !application.pdfData) {
      return NextResponse.json(
        { message: "Für diesen Antrag wurde keine PDF-Datei gefunden." },
        { status: 404 }
      );
    }

    const fileName = application.pdfFileName || "mitgliedsantrag.pdf";
    const mimeType = application.pdfMimeType || "application/pdf";

    return new NextResponse(Buffer.from(application.pdfData), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PDF LOAD ERROR:", error);

    return NextResponse.json(
      { message: "PDF konnte nicht geladen werden." },
      { status: 500 }
    );
  }
}