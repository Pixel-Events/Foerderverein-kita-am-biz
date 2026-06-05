import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const memberId = cookieStore.get("member_auth")?.value;

    if (!memberId) {
      return NextResponse.json(
        { message: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { newPassword, confirmPassword } = await request.json();

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "Bitte beide Passwortfelder ausfüllen." },
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.member.update({
      where: { id: memberId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Passwort wurde geändert.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Passwort konnte nicht geändert werden." },
      { status: 500 }
    );
  }
}