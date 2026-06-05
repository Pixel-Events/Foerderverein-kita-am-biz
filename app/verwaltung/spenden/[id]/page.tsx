import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import MarkReceiptButton from "../MarkReceiptButton";
import DeleteDonationButton from "../DeleteDonationButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SpendenDetailPage({ params }: Props) {
  const { id } = await params;

  const donation = await prisma.donation.findUnique({
    where: { id },
  });

  if (!donation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/verwaltung/spenden"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55] shadow-sm transition hover:border-[#3f6f55] hover:bg-[#f8f5ee]"
        >
          ← Zur Spendenverwaltung
        </Link>

        <div className="mt-8 rounded-[36px] bg-white p-8 shadow-xl md:p-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
                Spende
              </p>

              <h1 className="text-5xl font-bold text-[#3f6f55]">
                {donation.donorName}
              </h1>
            </div>

            <div className="rounded-full bg-[#eaf2ea] px-5 py-3 font-semibold text-[#3f6f55]">
              {donation.amount.toFixed(2)} €
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Detail
              label="Spendendatum"
              value={new Date(donation.donationDate).toLocaleDateString(
                "de-DE"
              )}
            />

            <Detail label="Spender" value={donation.donorName} />
            <Detail label="E-Mail" value={donation.donorEmail} />

            <Detail
              label="Betrag"
              value={`${donation.amount.toFixed(2)} €`}
            />

            <Detail
              label="Zahlungsart"
              value={
                donation.paymentMethod === "transfer"
                  ? "Überweisung"
                  : donation.paymentMethod === "cash"
                  ? "Barspende"
                  : donation.paymentMethod
              }
            />

            <Detail label="Verwendungszweck" value={donation.purpose} />

            <Detail label="Quittungsstatus" value={donation.receiptStatus} />
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-[#ece6dc] pt-8">
            {donation.receiptStatus === "Offen" && (
              <MarkReceiptButton id={donation.id} />
            )}

            <DeleteDonationButton id={donation.id} />
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
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-3xl bg-[#f8f5ee] p-5">
      <p className="mb-1 text-sm text-[#666]">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}