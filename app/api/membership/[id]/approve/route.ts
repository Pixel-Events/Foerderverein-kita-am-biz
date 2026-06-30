import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendMail } from "../../../../../lib/mail";
import { emailLayout } from "../../../../../lib/emailTemplates";

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

    const memberNumber = `FV-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(3, "0")}`;

    const initialPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

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

    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/mitglieder/login`;

    try {
      await sendMail({
        to: member.email,
        subject: "Ihr Zugang zum Mitgliederbereich",
        html: emailLayout({
          title: "Willkommen im Förderverein",
          intro: "Ihr Mitgliedsantrag wurde erfolgreich angenommen.",
          children: `
            <p>Hallo ${member.firstName},</p>

            <p>
              Wir freuen uns, Sie als Mitglied im Förderverein Kita am BiZ e. V.
              begrüßen zu dürfen.
            </p>

            <p>
              <strong>Mitgliedsnummer:</strong><br />
              ${member.memberNumber}
            </p>

            <p>
              <strong>E-Mail:</strong><br />
              ${member.email}
            </p>

            <p>
              <strong>Initialpasswort:</strong><br />
              ${initialPassword}
            </p>

            <p style="margin: 28px 0;">
              <a
                href="${loginUrl}"
                style="display:inline-block;background:#3f6f55;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold;"
              >
                Mitgliederbereich öffnen
              </a>
            </p>

            <p>
              Aus Sicherheitsgründen müssen Sie Ihr Passwort beim ersten Login
              ändern.
            </p>
          `,
        }),
      });
    } catch (mailError) {
      console.error("WELCOME MAIL ERROR:", mailError);
    }

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error("APPROVE ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Mitglied konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}