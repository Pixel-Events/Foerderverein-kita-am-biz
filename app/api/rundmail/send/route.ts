import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendMail } from "../../../../lib/mail";
import { emailLayout } from "../../../../lib/emailTemplates";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");
    const attachment = formData.get("attachment") as File | null;

    if (!subject || !message) {
      return NextResponse.json(
        { message: "Betreff und Nachricht sind erforderlich." },
        { status: 400 }
      );
    }

    const attachments = [];

    if (attachment && attachment.size > 0) {
      if (attachment.type !== "application/pdf") {
        return NextResponse.json(
          { message: "Es können nur PDF-Dateien angehängt werden." },
          { status: 400 }
        );
      }

      const arrayBuffer = await attachment.arrayBuffer();

      attachments.push({
        filename: attachment.name,
        content: Buffer.from(arrayBuffer),
      });
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
            `,
          }),
          attachments,
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