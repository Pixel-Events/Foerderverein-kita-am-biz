import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { message: "Antrag wurde nicht gefunden." },
        { status: 404 }
      );
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        email: application.email,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "Dieses Mitglied existiert bereits." },
        { status: 400 }
      );
    }

    const count = await prisma.member.count();
    const initialPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

    const memberNumber = `FV-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(3, "0")}`;

    const member = await prisma.member.create({
  data: {
    memberNumber,
    status: "Aktiv",

    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,

    street: application.street,
    zip: application.zip,
    city: application.city,

    membershipFee: application.membershipFee,
    paymentMethod: application.paymentMethod,

    iban: application.iban,
    accountHolder: application.accountHolder,

    password: hashedPassword,
    mustChangePassword: true,
  },
});

    await prisma.membershipApplication.update({
      where: { id },
      data: {
        status: "Mitglied",
      },
    });

    return NextResponse.json({
      success: true,
      member,
      initialPassword,
    });
  } 
  
  catch (error: any) {
  console.error("APPROVE ERROR:", error);

  return NextResponse.json(
    {
      message: error?.message || "Mitglied konnte nicht erstellt werden.",
    },
    { status: 500 }
  );
}
}