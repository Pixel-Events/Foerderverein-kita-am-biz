import Link from "next/link";
import { prisma } from "../../lib/prisma";
import LogoutButton from "./LogoutButton";
import DeleteApplicationButton from "./DeleteApplicationButton";

export const dynamic = "force-dynamic";

export default async function VerwaltungPage() {
  const applications = await prisma.membershipApplication.findMany({
    where: {
      status: {
        not: "Mitglied",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const members = await prisma.member.findMany();
  const donations = await prisma.donation.findMany();
  const documents = await prisma.document.findMany();

  const activeMembers = members.filter((m) => m.status === "Aktiv");
  const restingMembers = members.filter((m) => m.status === "Ruhend");

  const yearlyFees = activeMembers.reduce(
    (sum, member) => sum + member.membershipFee,
    0
  );

  const donationSum = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  const openReceipts = donations.filter(
    (donation) => donation.receiptStatus === "Offen"
  ).length;

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#3f6f55]">
              Mitgliederverwaltung
            </h1>

            <p className="mt-2 text-[#666]">
              Verwaltung von Anträgen, Mitgliedern, Beiträgen, Spenden und Dokumenten.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/verwaltung/mitglieder/neu"
              className="rounded-full bg-[#8daa91] px-5 py-3 font-semibold text-white transition hover:bg-[#78987d]"
            >
              + Neues Mitglied
            </Link>

            <Link
              href="/verwaltung/mitglieder"
              className="rounded-full bg-[#3f6f55] px-5 py-3 font-semibold text-white transition hover:bg-[#335945]"
            >
              Mitglieder
            </Link>

            <Link
              href="/verwaltung/beitraege"
              className="rounded-full border border-[#d8cfc3] bg-white px-5 py-3 font-semibold text-[#3f6f55] transition hover:bg-[#f8f5ee]"
            >
              Beiträge
            </Link>

            <Link
              href="/verwaltung/spenden"
              className="rounded-full border border-[#d8cfc3] bg-white px-5 py-3 font-semibold text-[#3f6f55] transition hover:bg-[#f8f5ee]"
            >
              Spenden
            </Link>

            <Link
              href="/verwaltung/dokumente"
              className="rounded-full border border-[#d8cfc3] bg-white px-5 py-3 font-semibold text-[#3f6f55] transition hover:bg-[#f8f5ee]"
            >
              Dokumente
            </Link>

            <Link
              href="/verwaltung/rundmail"
              className="rounded-full bg-[#d4a84f] px-5 py-3 font-semibold text-white transition hover:bg-[#c3973f]"
            >
              Rundmail
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4 xl:grid-cols-8">
          <DashboardCard label="Offene Anträge" value={applications.length} />
          <DashboardCard label="Mitglieder gesamt" value={members.length} />
          <DashboardCard label="Aktive Mitglieder" value={activeMembers.length} />
          <DashboardCard label="Ruhend" value={restingMembers.length} />
          <DashboardCard label="Jahresbeiträge" value={`${yearlyFees.toFixed(0)} €`} />
          <DashboardCard label="Spenden gesamt" value={`${donationSum.toFixed(0)} €`} />
          <DashboardCard label="Offene Quittungen" value={openReceipts} />
          <DashboardCard label="Dokumente" value={documents.length} />
        </div>

        <p className="mb-6 text-[#555]">
          Hier erscheinen alle eingegangenen Beitrittsanträge.
        </p>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#eaf2ea] text-[#3f6f55]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">E-Mail</th>
                <th className="p-4">Beitrag</th>
                <th className="p-4">Zahlung</th>
                <th className="p-4">Status</th>
                <th className="p-4">Datum</th>
                <th className="p-4">Details</th>
                <th className="p-4">Aktion</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((application: any) => (
                <tr
                  key={application.id}
                  className="border-t border-[#ece6dc] transition hover:bg-[#f8f5ee]"
                >
                  <td className="p-4 font-medium">
                    <Link
                      href={`/verwaltung/${application.id}`}
                      className="text-[#3f6f55] hover:underline"
                    >
                      {application.firstName} {application.lastName}
                    </Link>
                  </td>

                  <td className="p-4">{application.email}</td>

                  <td className="p-4">
                    {application.membershipFee.toFixed(2)} €
                  </td>

                  <td className="p-4">
                    {application.paymentMethod === "sepa"
                      ? "SEPA"
                      : "Überweisung"}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-[#fff4cc] px-3 py-1 text-sm font-medium text-[#8a6d00]">
                      {application.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(application.createdAt).toLocaleDateString("de-DE")}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/verwaltung/${application.id}`}
                      className="rounded-full bg-[#8daa91] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#78987d]"
                    >
                      Öffnen
                    </Link>
                  </td>

                  <td className="p-4">
                    <DeleteApplicationButton id={application.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-[#666]">
              Es liegen aktuell keine Beitrittsanträge vor.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function DashboardCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm text-[#666]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#3f6f55]">{value}</p>
    </div>
  );
}