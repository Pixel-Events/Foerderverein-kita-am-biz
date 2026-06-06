import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

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
      <div className="mx-auto max-w-6xl">
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
            className="mb-4 text-5xl font-bold text-[#3f6f55]"
          >
            Hallo {member.firstName}
          </h1>

          <p className="mb-8 max-w-3xl text-[#555]">
            Willkommen in deinem persönlichen Mitgliederbereich. Hier kannst du deine
            Mitgliedsdaten einsehen, ausgewählte Daten bearbeiten und dein
            Passwort ändern.
          </p>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <InfoCard label="Mitgliedsnummer" value={member.memberNumber} />
            <InfoCard label="Status" value={member.status} />
            <InfoCard
              label="Eintrittsdatum"
              value={new Date(member.joinedAt).toLocaleDateString("de-DE")}
            />
            <InfoCard
              label="Jahresbeitrag"
              value={`${member.membershipFee.toFixed(2)} €`}
            />
            <InfoCard
              label="Zahlungsart"
              value={
                member.paymentMethod === "sepa"
                  ? "SEPA-Lastschrift"
                  : "Überweisung"
              }
            />
            <InfoCard
              label="Mandatsreferenz"
              value={member.mandateReference || "-"}
            />
          </div>

          <div className="rounded-[32px] bg-[#f8f5ee] p-6 md:p-8">
            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-6 text-3xl font-bold text-[#3f6f55]"
            >
              Meine Daten
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Detail label="Name" value={`${member.firstName} ${member.lastName}`} />
              <Detail label="E-Mail" value={member.email} />
              <Detail label="Telefon" value={member.phone} />
              <Detail label="Straße" value={member.street} />
              <Detail label="PLZ" value={member.zip} />
              <Detail label="Ort" value={member.city} />
              <Detail label="Kontoinhaber" value={member.accountHolder} />
              <Detail label="IBAN" value={member.iban} />
            </div>
          </div>

          <ProfileForm member={member} />

          <ChangePasswordForm />

          <div className="mt-8 rounded-3xl bg-[#f8f5ee] p-6">
            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-4 text-3xl font-bold text-[#3f6f55]"
            >
              Vereinsdokumente
            </h2>

            <p className="mb-5 text-[#666]">
              Hier findest du wichtige Dokumente des Fördervereins.
            </p>

            <a
              href="/dokumente/satzung.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white transition hover:bg-[#335945]"
            >
              Satzung öffnen
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-3xl bg-[#f8f5ee] p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#8daa91]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#3f6f55]">
        {value || "-"}
      </p>
    </div>
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
    <div className="rounded-3xl bg-white p-5">
      <p className="mb-1 text-sm text-[#666]">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}