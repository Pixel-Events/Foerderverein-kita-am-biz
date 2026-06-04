import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import LogoutButton from "../LogoutButton";
import DeleteMemberButton from "./DeleteMemberButton";

export default async function MitgliederPage() {
  const members = await prisma.member.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link href="/verwaltung" className="text-[#3f6f55]">
              ← Zurück zur Verwaltung
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-[#3f6f55]">
              Mitglieder
            </h1>
          </div>

          <LogoutButton />
        </div>

        <p className="mb-10 text-[#555]">
          Hier erscheinen alle übernommenen Mitglieder des Fördervereins.
        </p>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#eaf2ea] text-[#3f6f55]">
              <tr>
                <th className="p-4">Mitgliedsnummer</th>
                <th className="p-4">Name</th>
                <th className="p-4">E-Mail</th>
                <th className="p-4">Beitrag</th>
                <th className="p-4">Zahlung</th>
                <th className="p-4">Status</th>
                <th className="p-4">Eintritt</th>
                <th className="p-4">Aktion</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member: any) => (
                <tr
                  key={member.id}
                  className="border-t border-[#ece6dc] transition hover:bg-[#f8f5ee]"
                >
                  <td className="p-4 font-semibold text-[#3f6f55]">
                    {member.memberNumber}
                  </td>

                  <td className="p-4">
                    {member.firstName} {member.lastName}
                  </td>

                  <td className="p-4">{member.email}</td>

                  <td className="p-4">
                    {member.membershipFee.toFixed(2)} €
                  </td>

                  <td className="p-4">
                    {member.paymentMethod === "sepa"
                      ? "SEPA"
                      : "Überweisung"}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-[#eaf2ea] px-3 py-1 text-sm font-medium text-[#3f6f55]">
                      {member.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(member.joinedAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="p-4">
  <DeleteMemberButton id={member.id} />
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {members.length === 0 && (
          <p className="mt-8 text-[#555]">Es gibt noch keine Mitglieder.</p>
        )}
      </div>
    </main>
  );
}