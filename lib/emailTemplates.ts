export function emailLayout({
  title,
  intro,
  buttonText,
  buttonUrl,
  children,
}: {
  title: string;
  intro?: string;
  buttonText?: string;
  buttonUrl?: string;
  children: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f8f5ee; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:white; border-radius:28px; padding:32px; color:#2f2f2f;">
        <p style="font-size:13px; letter-spacing:0.18em; text-transform:uppercase; color:#8daa91; font-weight:bold;">
          Förderverein Kita am BiZ e. V.
        </p>

        <h1 style="color:#3f6f55; font-size:30px; margin:12px 0 20px;">
          ${title}
        </h1>

        ${
          intro
            ? `<p style="font-size:16px; line-height:1.7; color:#555;">${intro}</p>`
            : ""
        }

        <div style="font-size:16px; line-height:1.7; color:#555;">
          ${children}
             <div style="margin-top:32px;">
                <p>Beste Grüße</p>

                <p style="line-height:1.7;">
                  <strong>Der Vorstand des Fördervereins Kita am BiZ e. V.</strong><br />
                  Matthias Dengler<br />
                  Mario Mai<br />
                  Johanna Ehses
                </p>
              </div>
        </div>

        ${
          buttonText && buttonUrl
            ? `
              <p style="margin:28px 0;">
                <a href="${buttonUrl}" style="display:inline-block; background:#3f6f55; color:white; padding:14px 22px; border-radius:999px; text-decoration:none; font-weight:bold;">
                  ${buttonText}
                </a>
              </p>
            `
            : ""
        }

        <hr style="border:none; border-top:1px solid #ece6dc; margin:32px 0;" />

        <p style="font-size:14px; line-height:1.6; color:#777;">
          Förderverein Kita am BiZ e. V.<br />
          Von-Steuben-Straße 31 · 67549 Worms<br />
          info@foerderverein-kita-am-biz.de
        </p>
      </div>
    </div>
  `;
}