"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileForm({ member }: { member: any }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      email: formData.get("email"),
      phone: formData.get("phone"),
      street: formData.get("street"),
      zip: formData.get("zip"),
      city: formData.get("city"),
      accountHolder: formData.get("accountHolder"),
      iban: formData.get("iban"),
    };

    const response = await fetch("/api/member/profile/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.message || "Daten konnten nicht gespeichert werden.");
      return;
    }

    setMessage("Daten wurden erfolgreich gespeichert.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="mt-8 rounded-3xl bg-[#f8f5ee] p-6">
      <h2 className="mb-6 text-3xl font-bold text-[#3f6f55]">
        Meine Daten bearbeiten
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
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

        <Field label="Kontoinhaber">
          <input name="accountHolder" defaultValue={member.accountHolder || ""} className="input-field" />
        </Field>

        <Field label="IBAN">
          <input name="iban" defaultValue={member.iban || ""} className="input-field" />
        </Field>
      </div>

      {message && (
        <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-[#3f6f55]">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
      >
        Änderungen speichern
      </button>
    </form>
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