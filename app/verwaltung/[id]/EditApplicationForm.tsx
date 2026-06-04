"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditApplicationForm({ application }: { application: any }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

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
      message: formData.get("message"),
    };

    const response = await fetch(`/api/membership/${application.id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Speichern fehlgeschlagen.");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="rounded-full bg-[#eaf2ea] px-6 py-3 font-semibold text-[#3f6f55]"
      >
        Angaben bearbeiten
      </button>
    );
  }

  return (
    <form onSubmit={handleSave} className="mt-8 rounded-3xl bg-[#f8f5ee] p-6">
      <h2 className="mb-6 text-2xl font-bold text-[#3f6f55]">
        Angaben bearbeiten
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="firstName" defaultValue={application.firstName} placeholder="Vorname" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="lastName" defaultValue={application.lastName} placeholder="Nachname" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="email" defaultValue={application.email} placeholder="E-Mail" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="phone" defaultValue={application.phone || ""} placeholder="Telefon" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="street" defaultValue={application.street} placeholder="Straße" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="zip" defaultValue={application.zip} placeholder="PLZ" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="city" defaultValue={application.city} placeholder="Ort" className="rounded-2xl border px-4 py-3 text-black" />

        <input
          name="membershipFee"
          type="number"
          min="24"
          defaultValue={application.membershipFee}
          placeholder="Beitrag"
          className="rounded-2xl border px-4 py-3 text-black"
        />

        <select
          name="paymentMethod"
          defaultValue={application.paymentMethod}
          className="rounded-2xl border px-4 py-3 text-black"
        >
          <option value="sepa">SEPA-Lastschrift</option>
          <option value="transfer">Überweisung</option>
        </select>

        <input name="accountHolder" defaultValue={application.accountHolder || ""} placeholder="Kontoinhaber" className="rounded-2xl border px-4 py-3 text-black" />
        <input name="iban" defaultValue={application.iban || ""} placeholder="IBAN" className="rounded-2xl border px-4 py-3 text-black" />
      </div>

      <textarea
        name="message"
        defaultValue={application.message || ""}
        placeholder="Nachricht"
        className="mt-4 min-h-28 w-full rounded-2xl border px-4 py-3 text-black"
      />

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white"
        >
          Speichern
        </button>

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-full bg-white px-6 py-3 font-semibold text-[#3f6f55]"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}