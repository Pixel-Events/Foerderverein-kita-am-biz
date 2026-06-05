import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.donation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Spende wurde gelöscht.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Spende konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}