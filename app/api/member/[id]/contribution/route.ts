import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const currentYear = new Date().getFullYear();

    const member = await prisma.member.findUnique({
      where: { id },
      select: {
        id: true,
        contributionPaidYear: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Mitglied wurde nicht gefunden." },
        { status: 404 }
      );
    }

    const isPaidForCurrentYear = member.contributionPaidYear === currentYear;

    const updatedMember = await prisma.member.update({
      where: { id },
      data: isPaidForCurrentYear
        ? {
            contributionPaidYear: null,
            contributionPaidAt: null,
          }
        : {
            contributionPaidYear: currentYear,
            contributionPaidAt: new Date(),
          },
      select: {
        id: true,
        contributionPaidYear: true,
        contributionPaidAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      member: updatedMember,
    });
  } catch (error: any) {
    console.error("CONTRIBUTION UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Beitragsstatus konnte nicht geändert werden.",
      },
      { status: 500 }
    );
  }
}