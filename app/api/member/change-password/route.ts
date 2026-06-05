import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const memberId = cookieStore.get("member_auth")?.value;

    if (!memberId) {
      return NextResponse.json(
        { message: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member || !member.password) {
      return NextResponse.json(
        { message: "Mitglied nicht gefunden." },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      member.password
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "Aktuelles Passwort ist falsch." },
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
      {
        message:
          error?.message || "Passwort konnte nicht geändert werden.",
      },
      { status: 500 }
    );
  }
}