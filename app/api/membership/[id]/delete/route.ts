import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    console.log("DELETE MEMBER ID:", id);

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Mitglied wurde nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Mitglied wurde gelöscht.",
    });
  } catch (error: any) {
    console.error("DELETE MEMBER ERROR:", error);

    return NextResponse.json(
      { message: error?.message || "Mitglied konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}