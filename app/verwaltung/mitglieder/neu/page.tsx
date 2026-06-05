"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NeuesMitgliedPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      street: formData.get("street"),
      zip: formData.get("zip"),
      city: formData.get("city"),
      membershipFee: formData.get("membershipFee"),
      paymentMethod: formData.get("paymentMethod"),
      accountHolder: formData.get("accountHolder"),
      iban: formData.get("iban"),
      status: formData.get("status"),
    };

    const response = await fetch("/api/member/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Mitglied konnte nicht angelegt werden.");
      return;
    }

    setSuccessMessage("Mitglied wurde erfolgreich angelegt.");

    setTimeout(() => {
      router.push("/verwaltung/mitglieder");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="relative min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6">
          <div className="max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf2ea] text-3xl text-[#3f6f55]">
              ✓
            </div>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-3 text-3xl font-bold text-[#3f6f55]"
            >
              Erfolgreich gespeichert
            </h2>

            <p className="text-[#555]">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <Link
          href="/verwaltung/mitglieder"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55] shadow-sm transition hover:border-[#3f6f55] hover:bg-[#f8f5ee]"
        >
          ← Zur Mitgliederliste
        </Link>

        <form
          onSubmit={handleCreate}
          className="mt-8 rounded-[36px] bg-white p-8 shadow-xl md:p-12"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Mitgliederverwaltung
          </p>

          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-8 text-5xl font-bold text-[#3f6f55]"
          >
            Neues Mitglied
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              name="firstName"
              placeholder="Vorname *"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
              required
            />

            <input
              name="lastName"
              placeholder="Nachname *"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="E-Mail *"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
              required
            />

            <input
              name="phone"
              placeholder="Telefon"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
            />

            <input
              name="street"
              placeholder="Straße und Hausnummer"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400 md:col-span-2"
            />

            <input
              name="zip"
              placeholder="PLZ"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
            />

            <input
              name="city"
              placeholder="Ort"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
            />

            <input
              name="membershipFee"
              type="number"
              min="24"
              defaultValue="24"
              placeholder="Jahresbeitrag"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
              required
            />

            <select
              name="paymentMethod"
              defaultValue="sepa"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
            >
              <option value="sepa">SEPA-Lastschrift</option>
              <option value="transfer">Überweisung</option>
            </select>

            <input
              name="accountHolder"
              placeholder="Kontoinhaber"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
            />

            <input
              name="iban"
              placeholder="IBAN"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black placeholder:text-gray-400"
            />

            <select
              name="status"
              defaultValue="Aktiv"
              className="rounded-2xl border border-[#ddd4c8] bg-white px-5 py-4 text-black"
            >
              <option value="Aktiv">Aktiv</option>
              <option value="Ruhend">Ruhend</option>
              <option value="Ausgetreten">Ausgetreten</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-10 rounded-full bg-[#3f6f55] px-10 py-4 font-semibold text-white transition hover:bg-[#335945]"
          >
            Mitglied anlegen
          </button>
        </form>
      </div>
    </main>
  );
}