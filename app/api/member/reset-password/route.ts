import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "Bitte alle Felder ausfüllen." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Die Passwörter stimmen nicht überein." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Das Passwort muss mindestens 8 Zeichen lang sein." },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Der Link ist ungültig oder abgelaufen." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.member.update({
      where: { id: member.id },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Passwort wurde erfolgreich geändert.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Passwort konnte nicht zurückgesetzt werden.",
      },
      { status: 500 }
    );
  }
}