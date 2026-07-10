import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusButtons from "./StatusButtons";
import ApproveMemberButton from "./ApproveMemberButton";
import EditApplicationForm from "./EditApplicationForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AntragDetailPage({ params }: Props) {
  const { id } = await params;

  const application = await prisma.membershipApplication.findUnique({
    where: { id },
  });

  if (!application) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-4xl">
        <Link href="/verwaltung" className="text-[#3f6f55]">
          ← Zurück zur Verwaltung
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#3f6f55]">
              Beitrittsantrag
            </h1>

            <p className="mt-2 text-sm text-[#666]">
              Antrag von {application.firstName} {application.lastName}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Detail label="Vorname" value={application.firstName} />
            <Detail label="Nachname" value={application.lastName} />
            <Detail label="E-Mail" value={application.email} />
            <Detail label="Telefon" value={application.phone} />
            <Detail label="Straße" value={application.street} />
            <Detail label="PLZ" value={application.zip} />
            <Detail label="Ort" value={application.city} />
            <Detail label="Beitrag" value={`${application.membershipFee} €`} />

            <Detail
              label="Zahlungsart"
              value={
                application.paymentMethod === "sepa"
                  ? "SEPA-Lastschrift"
                  : "Überweisung"
              }
            />

            <Detail label="Kontoinhaber" value={application.accountHolder} />
            <Detail label="IBAN" value={application.iban} />
            <Detail label="Status" value={application.status} />

            <Detail
              label="Antrag erstellt"
              value={new Date(application.createdAt).toLocaleDateString(
                "de-DE"
              )}
            />

            <Detail
              label="E-Mail versendet"
              value={
                application.mailSentAt
                  ? new Date(application.mailSentAt).toLocaleString("de-DE")
                  : "Nein"
              }
            />
          </div>

          <div className="mt-8 rounded-2xl bg-[#f8f5ee] p-4">
            <p className="mb-2 font-semibold text-[#3f6f55]">
              E-Mail-Versand
            </p>

            {application.mailSentAt ? (
              <p className="inline-flex rounded-full bg-[#eaf2ea] px-3 py-1 text-sm font-semibold text-[#3f6f55]">
                Versendet am{" "}
                {new Date(application.mailSentAt).toLocaleString("de-DE")}
              </p>
            ) : (
              <p className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                Nicht versendet
              </p>
            )}

            {application.mailError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-semibold">
                  E-Mail konnte nicht versendet werden
                </p>
                <p className="mt-2 break-words">{application.mailError}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <p className="mb-3 font-semibold text-[#3f6f55]">Kommunikation</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f8f5ee] p-4">
                <p className="text-sm text-[#666]">Newsletter erhalten</p>

                <p
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    application.newsletterConsent
                      ? "bg-[#eaf2ea] text-[#3f6f55]"
                      : "bg-[#f1ece4] text-[#777]"
                  }`}
                >
                  {application.newsletterConsent ? "Ja" : "Nein"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5ee] p-4">
                <p className="text-sm text-[#666]">
                  Informationen per E-Mail erhalten
                </p>

                <p
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    application.emailInfoConsent
                      ? "bg-[#eaf2ea] text-[#3f6f55]"
                      : "bg-[#f1ece4] text-[#777]"
                  }`}
                >
                  {application.emailInfoConsent ? "Ja" : "Nein"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-2 font-semibold text-[#3f6f55]">Nachricht</p>

            <p className="rounded-2xl bg-[#f8f5ee] p-4">
              {application.message || "Keine Nachricht"}
            </p>
          </div>

          <div className="mt-8">
            <EditApplicationForm application={application} />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {application.status !== "Mitglied" && (
              <ApproveMemberButton id={application.id} />
            )}

            <StatusButtons id={application.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | Date | null | undefined;
}) {
  return (
    <div className="rounded-2xl bg-[#f8f5ee] p-4">
      <p className="text-sm text-[#666]">{label}</p>
      <p className="font-semibold">{value ? String(value) : "-"}</p>
    </div>
  );
}