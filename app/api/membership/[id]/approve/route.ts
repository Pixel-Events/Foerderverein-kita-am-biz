import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendMail } from "../../../../../lib/mail";

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
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2f2f;">
            <h2 style="color: #3f6f55;">Willkommen im Förderverein Kita am BiZ e. V.</h2>

            <p>Hallo ${member.firstName},</p>

            <p>Ihr Mitgliedsantrag wurde angenommen. Sie wurden als Mitglied im Förderverein Kita am BiZ e. V. aufgenommen.</p>

            <p><strong>Mitgliedsnummer:</strong> ${member.memberNumber}</p>

            <p>Sie können sich ab sofort im Mitgliederbereich einloggen:</p>

            <p>
              <a href="${loginUrl}" style="display:inline-block;background:#3f6f55;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;">
                Zum Mitgliederbereich
              </a>
            </p>

            <p><strong>E-Mail:</strong> ${member.email}</p>
            <p><strong>Initialpasswort:</strong> ${initialPassword}</p>

            <p>Bitte ändern Sie Ihr Passwort nach dem ersten Login.</p>

            <p>
              Vielen Dank für Ihre Unterstützung!<br />
              Förderverein Kita am BiZ e. V.
            </p>
          </div>
        `,
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