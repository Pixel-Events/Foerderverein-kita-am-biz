import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function VerwaltungPage() {
  const applications = await prisma.membershipApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-4xl font-bold text-[#3f6f55]">
          Mitgliederverwaltung
        </h1>

        <p className="mb-10 text-[#555]">
          Hier erscheinen alle eingegangenen Beitrittsanträge. Klicke auf einen
          Antrag, um alle Angaben zu sehen.
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
              </tr>
            </thead>

            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-t border-[#ece6dc] transition hover:bg-[#f8f5ee]"
                >
                  <td className="p-4 font-medium">
                    <Link
                      href={`/verwaltung/${application.id}`}
                      className="text-[#3f6f55] hover:underline"
                    >
                      {application.firstName || "-"}{" "}
                      {application.lastName || ""}
                    </Link>
                  </td>

                  <td className="p-4">{application.email || "-"}</td>

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
                    {new Date(application.createdAt).toLocaleDateString(
                      "de-DE"
                    )}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/verwaltung/${application.id}`}
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

        {applications.length === 0 && (
          <p className="mt-8 text-[#555]">
            Es liegen noch keine Beitrittsanträge vor.
          </p>
        )}
      </div>
    </main>
  );
}