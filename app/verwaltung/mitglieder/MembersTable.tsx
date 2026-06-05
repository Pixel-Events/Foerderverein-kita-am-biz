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

    {/* Mobile Kartenansicht */}
    <div className="grid gap-4 md:hidden">
      {filteredMembers.map((member) => (
        <div
          key={member.id}
          className="rounded-3xl bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-[#3f6f55]">
            {member.memberNumber}
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#2f2f2f]">
            {member.firstName} {member.lastName}
          </h3>

          <p className="mt-2 text-sm text-[#666]">{member.email}</p>

          <div className="mt-4 grid gap-2 text-sm">
            <p>
              <strong>Beitrag:</strong>{" "}
              {member.membershipFee.toFixed(2)} €
            </p>
            <p>
              <strong>Zahlung:</strong>{" "}
              {member.paymentMethod === "sepa"
                ? "SEPA"
                : "Überweisung"}
            </p>
            <p>
              <strong>Status:</strong> {member.status}
            </p>
            <p>
              <strong>Eintritt:</strong>{" "}
              {new Date(member.joinedAt).toLocaleDateString("de-DE")}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/verwaltung/mitglieder/${member.id}`}
              className="rounded-full bg-[#8daa91] px-4 py-2 text-sm font-semibold text-white"
            >
              Öffnen
            </Link>

            <DeleteMemberButton id={member.id} />
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Tabelle */}
    <div className="hidden overflow-hidden rounded-3xl bg-white shadow-xl md:block">
      <table className="w-full border-collapse text-left">
        {/* hier bleibt deine bestehende Tabelle unverändert */}
      </table>
    </div>

    {filteredMembers.length === 0 && (
      <p className="mt-8 text-[#555]">Keine Mitglieder gefunden.</p>
    )}
  </>
);
}