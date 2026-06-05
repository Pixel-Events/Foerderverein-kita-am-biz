import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const donation = await prisma.donation.create({
        data: {
            donorName: data.donorName,
            donorEmail: data.donorEmail || null,
            amount: Number(data.amount),
            purpose: data.purpose || null,
            paymentMethod: data.paymentMethod,
            receiptStatus:
            data.receiptStatus || "Offen",
        },
        });

    return NextResponse.json({
      success: true,
      donation,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error?.message || "Spende konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}