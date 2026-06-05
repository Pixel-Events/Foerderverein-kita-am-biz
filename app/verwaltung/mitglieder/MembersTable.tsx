"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteMemberButton from "./DeleteMemberButton";

export default function MembersTable({ members }: { members: any[] }) {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) => {
    const searchText = `${member.memberNumber} ${member.firstName} ${member.lastName} ${member.email}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nach Name, E-Mail oder Mitgliedsnummer suchen..."
          className="w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400 shadow-sm"
        />
      </div>

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
              <th className="p-4">Details</th>
              <th className="p-4">Aktion</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
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

                <td className="p-4">{member.membershipFee.toFixed(2)} €</td>

                <td className="p-4">
                  {member.paymentMethod === "sepa" ? "SEPA" : "Überweisung"}
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
                  <Link
                    href={`/verwaltung/mitglieder/${member.id}`}
                    className="rounded-full bg-[#8daa91] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#78987d]"
                  >
                    Öffnen
                  </Link>
                </td>

                <td className="p-4">
                  <DeleteMemberButton id={member.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMembers.length === 0 && (
        <p className="mt-8 text-[#555]">Keine Mitglieder gefunden.</p>
      )}
    </>
  );
}