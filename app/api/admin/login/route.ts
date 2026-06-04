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

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Login-Daten sind nicht korrekt." },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcrypt.compare(password, admin.password);

    if (!passwordIsValid) {
      return NextResponse.json(
        { message: "Login-Daten sind nicht korrekt." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login erfolgreich.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    response.cookies.set("admin_auth", admin.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Login konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}