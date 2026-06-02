import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (
      !["Neuer Antrag", "Genehmigt", "Abgelehnt"].includes(status)
    ) {
      return NextResponse.json(
        {
          message: "Ungültiger Status",
        },
        {
          status: 400,
        }
      );
    }

    const application =
      await prisma.membershipApplication.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Status konnte nicht geändert werden.",
      },
      {
        status: 500,
      }
    );
  }
}