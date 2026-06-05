import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();

    const membershipFee = Number(data.membershipFee);

    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { message: "Vorname, Nachname und E-Mail sind erforderlich." },
        { status: 400 }
      );
    }

    if (!membershipFee || membershipFee < 24) {
      return NextResponse.json(
        { message: "Der Jahresbeitrag muss mindestens 24 € betragen." },
        { status: 400 }
      );
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        street: data.street || "",
        zip: data.zip || "",
        city: data.city || "",
        membershipFee,
        paymentMethod: data.paymentMethod || "sepa",
        accountHolder: data.accountHolder || null,
        iban: data.iban || null,
        mandateReference: data.mandateReference || null,
        status: data.status || "Aktiv",
      },
    });

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error("UPDATE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Mitglied konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}