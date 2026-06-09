import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendMail } from "../../../../lib/mail";
import { emailLayout } from "../../../../lib/emailTemplates";

export async function POST(request: Request) {
  try {
    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { message: "Betreff und Nachricht sind erforderlich." },
        { status: 400 }
      );
    }

    const members = await prisma.member.findMany({
      where: {
        status: "Aktiv",
        email: {
          not: "",
        },
      },
    });

    let sentCount = 0;

    for (const member of members) {
      try {
        await sendMail({
          to: member.email,
          subject,
          html: emailLayout({
            title: subject,
            intro: `Hallo ${member.firstName},`,
            children: `
              <p>${message.replace(/\n/g, "<br />")}</p>

              <p>
                Viele Grüße<br />
                Förderverein Kita am BiZ e. V.
              </p>
            `,
          }),
        });

        sentCount++;
      } catch (mailError) {
        console.error(`RUNDMAIL ERROR ${member.email}:`, mailError);
      }
    }

    return NextResponse.json({
      success: true,
      count: sentCount,
    });
  } catch (error: any) {
    console.error("RUNDMAIL SEND ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Rundmail konnte nicht versendet werden.",
      },
      { status: 500 }
    );
  }
}