import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import LogoutButton from "../LogoutButton";
import MembersTable from "./MembersTable";

export default async function MitgliederPage() {
  const members = await prisma.member.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/verwaltung" className="text-[#3f6f55]">
              ← Zurück zur Verwaltung
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-[#3f6f55]">
              Mitglieder
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/verwaltung/mitglieder/neu"
              className="rounded-full bg-[#3f6f55] px-5 py-3 font-semibold text-white transition hover:bg-[#335945]"
            >
              + Neues Mitglied
            </Link>

            <LogoutButton />
          </div>
        </div>

        <p className="mb-10 text-[#555]">
          Hier erscheinen alle übernommenen Mitglieder des Fördervereins.
        </p>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Mitglieder gesamt" value={members.length} />

          <StatCard
            label="Aktiv"
            value={members.filter((m) => m.status === "Aktiv").length}
          />

          <StatCard
            label="Ruhend"
            value={members.filter((m) => m.status === "Ruhend").length}
          />

          <StatCard
            label="Jahresbeiträge"
            value={`${members
              .filter((m) => m.status === "Aktiv")
              .reduce((sum, member) => sum + member.membershipFee, 0)
              .toFixed(0)} €`}
          />
        </div>

        <MembersTable members={members} />

        {members.length === 0 && (
          <p className="mt-8 text-[#555]">Es gibt noch keine Mitglieder.</p>
        )}
      </div>
    </main>
  );
}

function StatCard({
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