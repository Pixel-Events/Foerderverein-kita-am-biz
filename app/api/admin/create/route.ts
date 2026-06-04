import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password, secret } = await request.json();

    if (secret !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Nicht berechtigt." },
        { status: 401 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, E-Mail und Passwort sind erforderlich." },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin existiert bereits." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Admin konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}