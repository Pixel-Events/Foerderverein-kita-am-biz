import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import LogoutButton from "../LogoutButton";
import MarkReceiptButton from "./MarkReceiptButton";
import DeleteDonationButton from "./DeleteDonationButton";

export default async function SpendenVerwaltungPage() {
  const donations = await prisma.donation.findMany({
    orderBy: {
      donationDate: "desc",
    },
  });

  const total = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  const currentYear = new Date().getFullYear();

  const thisYearTotal = donations
    .filter(
      (donation) =>
        new Date(donation.donationDate).getFullYear() === currentYear
    )
    .reduce((sum, donation) => sum + donation.amount, 0);

  const openReceipts = donations.filter(
  (donation) => donation.receiptStatus === "Offen"
).length;

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/verwaltung" className="text-[#3f6f55]">
              ← Zurück zur Verwaltung
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-[#3f6f55]">
              Spendenverwaltung
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/verwaltung/spenden/neu"
              className="rounded-full bg-[#3f6f55] px-5 py-3 font-semibold text-white transition hover:bg-[#335945]"
            >
              + Neue Spende
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card label="Spenden gesamt" value={donations.length} />

          <Card label="Spendensumme" value={`${total.toFixed(2)} €`} />

          <Card
            label={`Spenden ${currentYear}`}
            value={`${thisYearTotal.toFixed(2)} €`}
          />

          <Card label="Offene Quittungen" value={openReceipts} />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#eaf2ea] text-[#3f6f55]">
              <tr>
                <th className="p-4">Datum</th>
                <th className="p-4">Spender</th>
                <th className="p-4">E-Mail</th>
                <th className="p-4">Betrag</th>
                <th className="p-4">Zahlungsart</th>
                <th className="p-4">Zweck</th>
                <th className="p-4">Quittung</th>
                <th className="p-4">Details</th>
                <th className="p-4">Aktion</th>
              </tr>
            </thead>

            <tbody>
              {donations.map((donation: any) => (
                <tr
                  key={donation.id}
                  className="border-t border-[#ece6dc] transition hover:bg-[#f8f5ee]"
                >
                  <td className="p-4">
                    {new Date(donation.donationDate).toLocaleDateString(
                      "de-DE"
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    {donation.donorName}
                  </td>

                  <td className="p-4">{donation.donorEmail || "-"}</td>

                  <td className="p-4 font-semibold text-[#3f6f55]">
                    {donation.amount.toFixed(2)} €
                  </td>

                  <td className="p-4">
                    {donation.paymentMethod === "transfer"
                      ? "Überweisung"
                      : donation.paymentMethod}
                  </td>
          
                  <td className="p-4">{donation.purpose || "-"}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        donation.receiptStatus === "Erstellt"
                          ? "bg-[#eaf2ea] text-[#3f6f55]"
                          : donation.receiptStatus === "Nicht erforderlich"
                          ? "bg-[#ececec] text-[#666]"
                          : "bg-[#fff4cc] text-[#8a6d00]"
                      }`}
                    >
                      {donation.receiptStatus}
                    </span>
                  </td>

                  <td className="flex gap-2 p-4">
                    {donation.receiptStatus === "Offen" && (
                      <MarkReceiptButton id={donation.id} />
                    )}

                    <DeleteDonationButton id={donation.id} />
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/verwaltung/spenden/${donation.id}`}
                      className="rounded-full bg-[#8daa91] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#78987d]"
                    >
                      Öffnen
                    </Link>
                  </td>
                                    </tr>
                  ))}
                  </tbody>
                  </table>
                  </div>

        {donations.length === 0 && (
          <p className="mt-8 text-[#555]">
            Es wurden noch keine Spenden erfasst.
          </p>
        )}
      </div>
    </main>
  );
}

function Card({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm text-[#666]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#3f6f55]">
        {value}
      </p>
    </div>
  );
}