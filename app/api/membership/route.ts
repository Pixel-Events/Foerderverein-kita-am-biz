import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fee =
      data.membershipFee === "custom"
        ? Number(data.customFee)
        : 24;

    if (!fee || fee < 24) {
      return NextResponse.json(
        { message: "Der Jahresbeitrag muss mindestens 24 € betragen." },
        { status: 400 }
      );
    }

    const application = await prisma.membershipApplication.create({
      data: {
        status: "Neuer Antrag",

        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || null,

        street: data.street || "",
        zip: data.zip || "",
        city: data.city || "",

        membershipFee: fee,
        paymentMethod: data.paymentMethod || "sepa",

        iban: data.iban || null,
        accountHolder: data.accountHolder || null,

        message: data.message || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Beitrittsantrag erfolgreich gespeichert.",
      application,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Speichern des Beitrittsantrags.",
      },
      { status: 500 }
    );
  }
}