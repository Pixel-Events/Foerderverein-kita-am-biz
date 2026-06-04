import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, newPassword, secret } = await request.json();

    if (secret !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Nicht berechtigt." },
        { status: 401 }
      );
    }

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "E-Mail und neues Passwort sind erforderlich." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin wurde nicht gefunden." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Passwort wurde erfolgreich geändert.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Passwort konnte nicht geändert werden." },
      { status: 500 }
    );
  }
}