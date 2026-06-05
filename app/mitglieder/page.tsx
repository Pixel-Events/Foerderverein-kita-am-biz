import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function MitgliederBereichPage() {
  const cookieStore = await cookies();
  const memberId = cookieStore.get("member_auth")?.value;

  if (!memberId) {
    redirect("/mitglieder/login");
  }

  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    redirect("/mitglieder/login");
  }

  if (member.mustChangePassword) {
    redirect("/mitglieder/passwort-aendern");
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55] shadow-sm transition hover:border-[#3f6f55] hover:bg-[#f8f5ee]"
        >
          ← Zur Startseite
        </Link>

        <section className="mt-8 rounded-[36px] bg-white p-8 shadow-xl md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Mitgliederbereich
          </p>

          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-6 text-5xl font-bold text-[#3f6f55]"
          >
            Hallo {member.firstName}
          </h1>

          <p className="mb-8 text-[#555]">
            Hier können Sie Ihre Mitgliedsdaten einsehen. Änderungen an Ihren
            Daten werden später direkt über diesen Bereich möglich sein.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Detail label="Mitgliedsnummer" value={member.memberNumber} />
            <Detail label="Status" value={member.status} />
            <Detail label="Name" value={`${member.firstName} ${member.lastName}`} />
            <Detail label="E-Mail" value={member.email} />
            <Detail label="Telefon" value={member.phone} />
            <Detail label="Straße" value={member.street} />
            <Detail label="PLZ" value={member.zip} />
            <Detail label="Ort" value={member.city} />
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
          </div>

          <ProfileForm member={member} />
        </section>
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