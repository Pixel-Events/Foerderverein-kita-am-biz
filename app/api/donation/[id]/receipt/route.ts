import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const donation = await prisma.donation.update({
      where: { id },
      data: {
        receiptStatus: "Erstellt",
      },
    });

    return NextResponse.json({
      success: true,
      donation,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.message ||
          "Status konnte nicht geändert werden.",
      },
      { status: 500 }
    );
  }
}