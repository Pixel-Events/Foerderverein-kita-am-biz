import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const pdfPath = path.join(
      process.cwd(),
      "public",
      "pdfs",
      "beitrittserklaerung.pdf"
    );

    const existingPdfBytes = await readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    function drawText(
      value: string | number | undefined | null,
      x: number,
      y: number,
      size = 9
    ) {
      page.drawText(String(value || ""), {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    }

    function drawCheck(x: number, y: number) {
      page.drawText("X", {
        x,
        y,
        size: 8.5,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    }

    function formatDate(dateString: string | undefined) {
      if (!dateString) return "";

      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("de-DE");
    }

    function normalizeIban(iban: string | undefined) {
      return (iban || "").replace(/\s+/g, "").toUpperCase();
    }

    function drawIbanInBoxes(ibanValue: string) {
      const cleanIban = ibanValue.replace(/\s+/g, "").toUpperCase();

      const boxLines = [
        85, 106, 128, 149, 170, 192, 213, 234, 255, 276, 298, 319,
        340, 362, 383, 404, 425, 447, 468, 489, 510, 532, 553,
      ];

      const y = 207;
      const size = 7.2;

      const chars = cleanIban.split("").slice(0, boxLines.length - 1);

      chars.forEach((char, index) => {
        const left = boxLines[index];
        const right = boxLines[index + 1];
        const boxCenter = left + (right - left) / 2;

        const charWidth = font.widthOfTextAtSize(char, size);
        const charX = boxCenter - charWidth / 2;

        page.drawText(char, {
          x: charX,
          y,
          size,
          font,
          color: rgb(0, 0, 0),
        });
      });
    }

    const contributionType =
      data.contributionType === "custom" ? "custom" : "regular";

    const membershipFee =
      contributionType === "custom" ? Number(data.membershipFee || 25) : 24;

    const fullName = `${data.lastName || ""}, ${data.firstName || ""}`.trim();
    const street = data.street || "";
    const cityLine = `${data.zip || ""} ${data.city || ""}`.trim();

    const today = new Date().toLocaleDateString("de-DE");
    const placeDate = `${data.city || ""}, ${today}`;

    const iban = normalizeIban(data.iban);

    // -------------------------
    // Beitrittserklärung
    // -------------------------

    drawText(fullName, 150, 658);
    drawText(formatDate(data.birthDate), 150, 633);
    drawText(street, 150, 608);
    drawText(cityLine, 150, 583);
    drawText(data.phone, 150, 558);
    drawText(data.email, 150, 533);

    if (data.newsletterAccepted) {
      drawCheck(37, 481);
    }

    if (contributionType === "regular") {
      drawCheck(37, 441);
    } else {
      drawCheck(37, 427);
      drawText(membershipFee.toFixed(2).replace(".", ","), 200, 426);
    }

    drawText(placeDate, 102, 396);

    // -------------------------
    // SEPA-Lastschriftmandat
    // -------------------------

    drawText(data.accountHolder || fullName, 165, 255);
    drawText(street, 110, 230);
    drawText(cityLine, 390, 230);

    drawIbanInBoxes(iban);

    drawText(data.bic, 90, 181, 8);
    drawText(placeDate, 102, 146);

    // Keine Unterschrift einfügen.
    // Die Unterschriftsfelder im PDF bleiben leer.

    const pdfBytes = await pdfDoc.save();

    const fileName = `mitgliedsantrag-${
      data.lastName || "test"
    }-${Date.now()}.pdf`;

    // -------------------------
    // Antrag + PDF speichern
    // -------------------------

    const application = await prisma.membershipApplication.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        street: data.street,
        zip: data.zip,
        city: data.city,

        birthDate: data.birthDate ? new Date(data.birthDate) : null,

        membershipFee,
        paymentMethod: "sepa",
        iban,
        bic: data.bic || null,
        accountHolder: data.accountHolder || null,

        newsletterConsent: Boolean(data.newsletterAccepted),
        emailInfoConsent: Boolean(data.emailInfoConsent),

        message: data.message || null,
        status: "Neu",

        pdfFileName: fileName,
        pdfMimeType: "application/pdf",
        pdfData: Buffer.from(pdfBytes),
      },
    });

    // -------------------------
    // PDF per E-Mail an Mitglied senden
    // -------------------------

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom =
      process.env.SMTP_FROM ||
      `Förderverein Kita am BiZ e. V. <${process.env.SMTP_USER}>`;

    let mailSent = false;
    let mailErrorMessage: string | null = null;

    if (!smtpHost || !smtpUser || !smtpPass) {
      mailErrorMessage =
        "SMTP-Konfiguration fehlt. Antrag wurde gespeichert, aber die E-Mail konnte nicht versendet werden.";
    } else {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            minVersion: "TLSv1.2",
          },
          connectionTimeout: 45000,
          greetingTimeout: 45000,
          socketTimeout: 45000,
});

        const mailPromise = transporter.sendMail({
          from: smtpFrom,
          to: data.email,
          subject: "Ihr Mitgliedsantrag beim Förderverein Kita am BiZ e. V.",
          text: `Liebe/r ${data.firstName} ${data.lastName},

vielen Dank für Ihren Mitgliedsantrag beim Förderverein Kita am BiZ e. V.

Im Anhang finden Sie Ihren vorausgefüllten Mitgliedsantrag als PDF.

Bitte prüfen Sie die Angaben, unterschreiben Sie den Antrag an den vorgesehenen Stellen und senden Sie ihn anschließend an uns zurück.

Sollten Sie keinen Zugang zu einem Drucker haben, antworten Sie einfach auf diese Mail und wir werden gemeinsam eine Lösung finden.

Viele Grüße
Förderverein Kita am BiZ e. V.`,
          attachments: [
            {
              filename: fileName,
              content: Buffer.from(pdfBytes),
              contentType: "application/pdf",
            },
          ],
        });

        await Promise.race([
          mailPromise,
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error("Zeitüberschreitung beim E-Mail-Versand.")
                ),
              20000
            )
          ),
        ]);

        mailSent = true;
      } catch (mailError) {
        console.error("MAIL SEND ERROR:", mailError);

        mailErrorMessage =
          mailError instanceof Error
            ? mailError.message
            : "E-Mail konnte nicht versendet werden.";
      }
    }

    // -------------------------
    // Mailstatus speichern
    // -------------------------

    await prisma.membershipApplication.update({
      where: { id: application.id },
      data: {
        mailSentAt: mailSent ? new Date() : null,
        mailError: mailSent ? null : mailErrorMessage,
      },
    });

    return NextResponse.json(
      {
        message: mailSent
          ? "Antrag wurde erstellt, PDF gespeichert und per E-Mail versendet."
          : "Antrag wurde erstellt und PDF gespeichert. Die E-Mail konnte nicht automatisch versendet werden.",
        applicationId: application.id,
        mailSent,
        mailError: mailErrorMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MEMBERSHIP SIGNED ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Antrag konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}