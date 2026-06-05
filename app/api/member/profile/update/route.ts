import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../../lib/prisma";

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

    const data = await request.json();

    await prisma.member.update({
      where: { id: memberId },
      data: {
        email: data.email,
        phone: data.phone || null,
        street: data.street || "",
        zip: data.zip || "",
        city: data.city || "",
        accountHolder: data.accountHolder || null,
        iban: data.iban || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Daten wurden gespeichert.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Daten konnten nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}