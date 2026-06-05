import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import EditMemberForm from "./EditMemberForm";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MitgliedDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: {
      id,
    },
  });

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/verwaltung/mitglieder"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55] shadow-sm transition hover:border-[#3f6f55] hover:bg-[#f8f5ee]"
        >
          ← Zur Mitgliederliste
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl md:p-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
                Mitglied
              </p>

              <h1
                style={{ fontFamily: "var(--font-baloo)" }}
                className="text-5xl font-bold text-[#3f6f55]"
              >
                {member.firstName} {member.lastName}
              </h1>
            </div>

            <div className="rounded-full bg-[#eaf2ea] px-5 py-3 font-semibold text-[#3f6f55]">
              {member.status}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Detail
              label="Mitgliedsnummer"
              value={member.memberNumber}
            />

            <Detail
              label="Eintrittsdatum"
              value={new Date(member.joinedAt).toLocaleDateString(
                "de-DE"
              )}
            />

            <Detail
              label="Vorname"
              value={member.firstName}
            />

            <Detail
              label="Nachname"
              value={member.lastName}
            />

            <Detail
              label="E-Mail"
              value={member.email}
            />

            <Detail
              label="Telefon"
              value={member.phone}
            />

            <Detail
              label="Straße"
              value={member.street}
            />

            <Detail
              label="PLZ"
              value={member.zip}
            />

            <Detail
              label="Ort"
              value={member.city}
            />

            <Detail
              label="Jahresbeitrag"
              value={`${member.membershipFee.toFixed(2)} €`}
            />

            <Detail
              label="Zahlungsart"
              value={
                member.paymentMethod === "sepa"
                  ? "SEPA-Lastschrift"
                  : "Überweisung"
              }
            />

            <Detail
              label="Kontoinhaber"
              value={member.accountHolder}
            />

            <Detail
              label="IBAN"
              value={member.iban}
            />
          </div>

        <div className="mt-8">
         <EditMemberForm member={member} />
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
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-3xl bg-[#f8f5ee] p-5">
      <p className="mb-1 text-sm text-[#666]">
        {label}
      </p>

      <p className="font-semibold">
        {value || "-"}
      </p>
    </div>
  );
}