import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../../lib/prisma";
import { sendMail } from "../../../../lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Bitte E-Mail-Adresse eingeben." },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return NextResponse.json({
        success: true,
        message:
          "Falls ein Mitglied mit dieser E-Mail existiert, wurde eine E-Mail versendet.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await prisma.member.update({
      where: { id: member.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/mitglieder/passwort-zuruecksetzen?token=${resetToken}`;

    await sendMail({
      to: member.email,
      subject: "Passwort zurücksetzen",
      html: `
        <p>Hallo ${member.firstName},</p>
        <p>Sie haben das Zurücksetzen Ihres Passworts angefordert.</p>
        <p>Der folgende Link ist eine Stunde gültig:</p>
        <p>
          <a href="${resetUrl}">
            Passwort zurücksetzen
          </a>
        </p>
        <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Falls ein Mitglied mit dieser E-Mail existiert, wurde eine E-Mail versendet.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.message || "Passwort-Zurücksetzen konnte nicht gestartet werden.",
      },
      { status: 500 }
    );
  }
}