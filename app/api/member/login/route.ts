import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-Mail und Passwort sind erforderlich." },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member || !member.password) {
      return NextResponse.json(
        { message: "Login-Daten sind nicht korrekt." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, member.password);

    if (!passwordValid) {
      return NextResponse.json(
        { message: "Login-Daten sind nicht korrekt." },
        { status: 401 }
      );
    }

    await prisma.member.update({
      where: { id: member.id },
      data: {
        lastLogin: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      mustChangePassword: member.mustChangePassword,
    });

    response.cookies.set("member_auth", member.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Login fehlgeschlagen." },
      { status: 500 }
    );
  }
}