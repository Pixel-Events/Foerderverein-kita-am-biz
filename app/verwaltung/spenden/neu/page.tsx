"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NeueSpendePage() {
  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/donation/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        donorName: formData.get("donorName"),
        donorEmail: formData.get("donorEmail"),
        amount: formData.get("amount"),
        purpose: formData.get("purpose"),
        paymentMethod: formData.get("paymentMethod"),
      }),
    });

    if (!response.ok) {
      alert("Spende konnte nicht gespeichert werden.");
      return;
    }

    alert("Spende erfolgreich gespeichert.");

    router.push("/verwaltung/spenden");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/verwaltung/spenden"
          className="text-[#3f6f55]"
        >
          ← Zurück zur Spendenverwaltung
        </Link>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl bg-white p-8 shadow-xl"
        >
          <h1 className="mb-8 text-4xl font-bold text-[#3f6f55]">
            Neue Spende
          </h1>

          <div className="grid gap-5">
  <label>
    <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
      Name des Spenders
    </span>
    <input
      name="donorName"
      placeholder="Max Mustermann"
      className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4 text-black"
      required
    />
  </label>

  <label>
    <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
      E-Mail
    </span>
    <input
      name="donorEmail"
      type="email"
      placeholder="max@beispiel.de"
      className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4 text-black"
    />
  </label>

  <label>
    <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
      Spendenbetrag (€)
    </span>
    <input
      name="amount"
      type="number"
      step="0.01"
      placeholder="50.00"
      className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4 text-black"
      required
    />
  </label>

  <label>
    <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
      Verwendungszweck
    </span>
    <input
      name="purpose"
      placeholder="z.B. Sommerfest 2026"
      className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4 text-black"
    />
  </label>

  <label>
    <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
      Zahlungsart
    </span>
    <select
      name="paymentMethod"
      defaultValue="transfer"
      className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4 text-black"
    >
      <option value="transfer">Überweisung</option>
      <option value="cash">Barspende</option>
      <option value="paypal">PayPal</option>
    </select>
  </label>

  <label>
  <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
    Spendenquittung
  </span>

  <select
    name="receiptStatus"
    defaultValue="Offen"
    className="w-full rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
  >
    <option value="Offen">
      Quittung erforderlich
    </option>

    <option value="Nicht erforderlich">
      Keine Quittung gewünscht
    </option>
  </select>
</label>

  <button
    type="submit"
    className="mt-4 rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
  >
    Spende speichern
  </button>
</div>
        </form>
      </div>
    </main>
  );
}