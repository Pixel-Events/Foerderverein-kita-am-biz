import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const membershipFee = Number(data.membershipFee);

    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        {
          message:
            "Vorname, Nachname und E-Mail sind erforderlich.",
        },
        { status: 400 }
      );
    }

    if (!membershipFee || membershipFee < 24) {
      return NextResponse.json(
        {
          message:
            "Der Jahresbeitrag muss mindestens 24 € betragen.",
        },
        { status: 400 }
      );
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        {
          message:
            "Ein Mitglied mit dieser E-Mail existiert bereits.",
        },
        { status: 400 }
      );
    }

    const count = await prisma.member.count();

    const memberNumber = `FV-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(3, "0")}`;

    const member = await prisma.member.create({
      data: {
        memberNumber,
        status: data.status || "Aktiv",

        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,

        street: data.street || "",
        zip: data.zip || "",
        city: data.city || "",

        membershipFee,

        paymentMethod:
          data.paymentMethod || "sepa",

        iban: data.iban || null,
        accountHolder: data.accountHolder || null,
        mandateReference: data.mandateReference || null,
      },
    });

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error?.message ||
          "Mitglied konnte nicht angelegt werden.",
      },
      { status: 500 }
    );
  }
}