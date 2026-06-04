import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const data = await request.json();

    const membershipFee = Number(data.membershipFee);

    if (!membershipFee || membershipFee < 24) {
      return NextResponse.json(
        { message: "Der Jahresbeitrag muss mindestens 24 € betragen." },
        { status: 400 }
      );
    }

    const application = await prisma.membershipApplication.update({
      where: { id },
      data: {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || null,

        street: data.street || "",
        zip: data.zip || "",
        city: data.city || "",

        membershipFee,
        paymentMethod: data.paymentMethod || "sepa",

        accountHolder: data.accountHolder || null,
        iban: data.iban || null,

        message: data.message || null,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Antrag konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}