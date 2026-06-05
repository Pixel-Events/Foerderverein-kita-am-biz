import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import LogoutButton from "../LogoutButton";

export const dynamic = "force-dynamic";
export default async function BeitraegePage() {
  const members = await prisma.member.findMany({
    where: {
      status: "Aktiv",
    },
    orderBy: {
      lastName: "asc",
    },
  });

  const total = members.reduce(
    (sum, member) => sum + member.membershipFee,
    0
  );

  const sepaMembers = members.filter(
    (member) => member.paymentMethod === "sepa"
  );

  const transferMembers = members.filter(
    (member) => member.paymentMethod === "transfer"
  );

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/verwaltung" className="text-[#3f6f55]">
              ← Zurück zur Verwaltung
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-[#3f6f55]">
              Beitragsverwaltung
            </h1>
          </div>

          <LogoutButton />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card label="Aktive Mitglieder" value={members.length} />
          <Card label="SEPA" value={sepaMembers.length} />
          <Card label="Überweisung" value={transferMembers.length} />
          <Card label="Erwartete Beiträge" value={`${total.toFixed(0)} €`} />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#eaf2ea] text-[#3f6f55]">
              <tr>
                <th className="p-4">Mitglied</th>
                <th className="p-4">Mitgliedsnummer</th>
                <th className="p-4">Beitrag</th>
                <th className="p-4">Zahlungsart</th>
                <th className="p-4">IBAN</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member: any) => (
                <tr
                  key={member.id}
                  className="border-t border-[#ece6dc] transition hover:bg-[#f8f5ee]"
                >
                  <td className="p-4">
                    {member.firstName} {member.lastName}
                  </td>

                  <td className="p-4 font-semibold text-[#3f6f55]">
                    {member.memberNumber}
                  </td>

                  <td className="p-4">
                    {member.membershipFee.toFixed(2)} €
                  </td>

                  <td className="p-4">
                    {member.paymentMethod === "sepa"
                      ? "SEPA-Lastschrift"
                      : "Überweisung"}
                  </td>

                  <td className="p-4">{member.iban || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {members.length === 0 && (
          <p className="mt-8 text-[#555]">
            Es gibt aktuell keine aktiven Mitglieder.
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
      <p className="mt-2 text-3xl font-bold text-[#3f6f55]">{value}</p>
    </div>
  );
}