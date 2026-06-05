"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditMemberForm({ member }: { member: any }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
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

    const response = await fetch(`/api/member/${member.id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Mitglied konnte nicht gespeichert werden.");
      return;
    }

    setSuccessMessage("Mitglied wurde erfolgreich gespeichert.");
    setEditing(false);
    router.refresh();
    }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white transition hover:bg-[#335945]"
      >
        Mitglied bearbeiten
      </button>
    );
  }

  return (
    <div className="mt-8">
      {successMessage && (
        <div className="mb-6 rounded-3xl bg-[#eaf2ea] p-5 text-[#3f6f55]">
          ✓ {successMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl bg-[#f8f5ee] p-6">
  <h2
    style={{ fontFamily: "var(--font-baloo)" }}
    className="mb-6 text-3xl font-bold text-[#3f6f55]"
  >
    Mitglied bearbeiten
  </h2>

  <div className="grid gap-5 md:grid-cols-2">
    <Field label="Vorname">
      <input name="firstName" defaultValue={member.firstName} className="input-field" required />
    </Field>

    <Field label="Nachname">
      <input name="lastName" defaultValue={member.lastName} className="input-field" required />
    </Field>

    <Field label="E-Mail">
      <input name="email" type="email" defaultValue={member.email} className="input-field" required />
    </Field>

    <Field label="Telefon">
      <input name="phone" defaultValue={member.phone || ""} className="input-field" />
    </Field>

    <Field label="Straße und Hausnummer" full>
      <input name="street" defaultValue={member.street || ""} className="input-field" />
    </Field>

    <Field label="PLZ">
      <input name="zip" defaultValue={member.zip || ""} className="input-field" />
    </Field>

    <Field label="Ort">
      <input name="city" defaultValue={member.city || ""} className="input-field" />
    </Field>

    <Field label="Jahresbeitrag">
      <input name="membershipFee" type="number" min="24" defaultValue={member.membershipFee} className="input-field" required />
    </Field>

    <Field label="Zahlungsart">
      <select name="paymentMethod" defaultValue={member.paymentMethod} className="input-field">
        <option value="sepa">SEPA-Lastschrift</option>
        <option value="transfer">Überweisung</option>
      </select>
    </Field>

    <Field label="Kontoinhaber">
      <input name="accountHolder" defaultValue={member.accountHolder || ""} className="input-field" />
    </Field>

    <Field label="IBAN">
      <input name="iban" defaultValue={member.iban || ""} className="input-field" />
    </Field>

    <Field label="Mandatsreferenz">
  <input
    name="mandateReference"
    defaultValue={member.mandateReference || ""}
    className="input-field"
  />
</Field>

    <Field label="Status">
      <select name="status" defaultValue={member.status} className="input-field">
        <option value="Aktiv">Aktiv</option>
        <option value="Ruhend">Ruhend</option>
        <option value="Ausgetreten">Ausgetreten</option>
      </select>
    </Field>
  </div>

  <div className="mt-6 flex flex-wrap gap-4">
    <button type="submit" className="rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white">
      Speichern
    </button>

    <button type="button" onClick={() => setEditing(false)} className="rounded-full bg-white px-6 py-3 font-semibold text-[#3f6f55]">
      Abbrechen
    </button>
  </div>
</form>
</div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold text-[#3f6f55]">
        {label}
      </span>
      {children}
    </label>
  );
}