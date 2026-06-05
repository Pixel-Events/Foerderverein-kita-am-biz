import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { sendMail } from "../../../../lib/mail";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const membershipFee = Number(data.membershipFee);

    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        {
          message: "Vorname, Nachname und E-Mail sind erforderlich.",
        },
        { status: 400 }
      );
    }

    if (!membershipFee || membershipFee < 24) {
      return NextResponse.json(
        {
          message: "Der Jahresbeitrag muss mindestens 24 € betragen.",
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
          message: "Ein Mitglied mit dieser E-Mail existiert bereits.",
        },
        { status: 400 }
      );
    }

    const count = await prisma.member.count();

    const memberNumber = `FV-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(3, "0")}`;

    const initialPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(initialPassword, 10);

    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/mitglieder/login`;

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
        paymentMethod: data.paymentMethod || "sepa",

        iban: data.iban || null,
        accountHolder: data.accountHolder || null,
        mandateReference: data.mandateReference || null,

        password: hashedPassword,
        mustChangePassword: true,
      },
    });

    await sendMail({
      to: member.email,
      subject: "Ihr Zugang zum Mitgliederbereich",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2f2f;">
          <h2 style="color: #3f6f55;">Willkommen im Förderverein Kita am BiZ e. V.</h2>

          <p>Hallo ${member.firstName},</p>

          <p>Sie wurden als Mitglied im Förderverein Kita am BiZ e. V. angelegt.</p>

          <p><strong>Mitgliedsnummer:</strong> ${member.memberNumber}</p>

          <p>
            Sie können sich ab sofort im Mitgliederbereich einloggen:
          </p>

          <p>
            <a href="${loginUrl}" style="display:inline-block;background:#3f6f55;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;">
              Zum Mitgliederbereich
            </a>
          </p>

          <p><strong>E-Mail:</strong> ${member.email}</p>
          <p><strong>Initialpasswort:</strong> ${initialPassword}</p>

          <p>Bitte ändern Sie Ihr Passwort nach dem ersten Login.</p>

          <p>
            Freundliche Grüße<br />
            Förderverein Kita am BiZ e. V.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error("CREATE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Mitglied konnte nicht angelegt werden.",
      },
      { status: 500 }
    );
  }
}