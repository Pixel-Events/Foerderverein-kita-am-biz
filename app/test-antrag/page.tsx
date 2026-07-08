"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type ContributionType = "regular" | "custom";

export default function TestAntragPage() {
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    street: "",
    zip: "",
    city: "",
    contributionType: "regular" as ContributionType,
    membershipFee: "24",
    iban: "",
    bic: "",
    accountHolder: "",
    newsletterAccepted: false,
    privacyAccepted: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;

    setSuccessMessage("");
    setApplicationId("");

    if (type === "checkbox") {
      const checked = e.target.checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    if (name === "contributionType") {
      const contributionType = value as ContributionType;

      setFormData((prev) => ({
        ...prev,
        contributionType,
        membershipFee: contributionType === "regular" ? "24" : "25",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function clearSignature() {
    signatureRef.current?.clear();
    setSuccessMessage("");
    setApplicationId("");
  }

  function resetForm() {
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      email: "",
      phone: "",
      street: "",
      zip: "",
      city: "",
      contributionType: "regular",
      membershipFee: "24",
      iban: "",
      bic: "",
      accountHolder: "",
      newsletterAccepted: false,
      privacyAccepted: false,
    });

    signatureRef.current?.clear();
    setSuccessMessage("");
    setApplicationId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.privacyAccepted) {
      alert("Bitte bestätige die Datenschutz-Hinweise.");
      return;
    }

    if (
      formData.contributionType === "custom" &&
      Number(formData.membershipFee) < 25
    ) {
      alert("Der individuelle Förderbeitrag muss mindestens 25 € betragen.");
      return;
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert("Bitte unterschreibe den Antrag.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setApplicationId("");

    try {
      const signatureImage = signatureRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      const response = await fetch("/api/test-antrag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          signatureImage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Antrag konnte nicht gespeichert werden."
        );
      }

      setSuccessMessage("Der Antrag wurde erfolgreich gespeichert.");
      setApplicationId(result.applicationId || "");

      signatureRef.current?.clear();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Es ist ein Fehler aufgetreten."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#a47745]">
          Testseite
        </p>

        <h1 className="mb-4 text-3xl font-bold">
          Mitgliedsantrag mit digitaler Unterschrift
        </h1>

        <p className="mb-8 text-gray-600">
          Diese Seite dient nur zum Testen. Nach dem Absenden wird euer
          bestehendes PDF mit den eingegebenen Daten und der Unterschrift
          ausgefüllt, gespeichert und im Adminbereich beim Antrag hinterlegt.
        </p>

        {successMessage && (
          <div className="mb-8 rounded-2xl border border-[#d7ead7] bg-[#eef8ee] p-5 text-[#2f6b3f]">
            <p className="font-semibold">{successMessage}</p>

            {applicationId && (
              <div className="mt-4 flex flex-wrap gap-3">
                
                <a
                  href={`/api/verwaltung/applications/${applicationId}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[#a47745] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f6338]"
                >
                  PDF direkt öffnen
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={resetForm}
              className="mt-4 text-sm font-semibold underline"
            >
              Neuen Test-Antrag erfassen
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Persönliche Daten</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="firstName"
                placeholder="Vorname"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="lastName"
                placeholder="Nachname"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="email"
                type="email"
                placeholder="E-Mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="phone"
                placeholder="Telefon optional"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="street"
                placeholder="Straße und Hausnummer"
                value={formData.street}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="zip"
                placeholder="PLZ"
                value={formData.zip}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="city"
                placeholder="Ort"
                value={formData.city}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Mitgliedsbeitrag</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <label
                className={`rounded-2xl border p-4 ${
                  formData.contributionType === "regular"
                    ? "border-[#a47745] bg-[#f8f5ee]"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="contributionType"
                  value="regular"
                  checked={formData.contributionType === "regular"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Regulärer Mitgliedsbeitrag: 24,00 € pro Geschäftsjahr
              </label>

              <label
                className={`rounded-2xl border p-4 ${
                  formData.contributionType === "custom"
                    ? "border-[#a47745] bg-[#f8f5ee]"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="contributionType"
                  value="custom"
                  checked={formData.contributionType === "custom"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Individueller Förderbeitrag ab 25,00 €
              </label>
            </div>

            {formData.contributionType === "custom" && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">
                  Individueller Förderbeitrag pro Geschäftsjahr
                </label>

                <input
                  name="membershipFee"
                  type="number"
                  min="25"
                  step="1"
                  placeholder="z. B. 30"
                  value={formData.membershipFee}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border px-4 py-3 md:w-1/2"
                />
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              SEPA-Lastschriftmandat
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="accountHolder"
                placeholder="Name Kontoinhaber"
                value={formData.accountHolder}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3 md:col-span-2"
              />

              <input
                name="iban"
                placeholder="IBAN"
                value={formData.iban}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-3"
              />

              <input
                name="bic"
                placeholder="BIC optional"
                value={formData.bic}
                onChange={handleChange}
                className="rounded-xl border px-4 py-3"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Einwilligungen</h2>

            <div className="space-y-4">
              <label className="flex gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="newsletterAccepted"
                  checked={formData.newsletterAccepted}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span>
                  Ich möchte ebenso weitere Vereinsinformationen über diese
                  E-Mail-Adresse erhalten.
                </span>
              </label>

              <label className="flex gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
                <span>
                  Ich bestätige, dass meine Angaben zur Bearbeitung des
                  Mitgliedsantrags und zur Mitgliederverwaltung verarbeitet
                  werden dürfen.
                </span>
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Unterschrift</h2>

            <p className="mb-3 text-sm text-gray-600">
              Bitte unterschreibe im folgenden Feld mit Maus, Finger oder Stift.
              Die Unterschrift wird anschließend in den Mitgliedsantrag und das
              SEPA-Mandat eingesetzt.
            </p>

            <div className="rounded-xl border bg-white p-3">
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{
                  className: "h-44 w-full rounded-lg bg-white",
                }}
              />
            </div>

            <button
              type="button"
              onClick={clearSignature}
              className="mt-2 text-sm text-gray-500 underline"
            >
              Unterschrift löschen
            </button>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#a47745] px-6 py-4 font-semibold text-white transition hover:bg-[#8f6338] disabled:opacity-60"
          >
            {loading ? "Antrag wird gespeichert..." : "Test-Antrag speichern"}
          </button>
        </form>
      </div>
    </main>
  );
}