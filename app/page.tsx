"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [membershipFee, setMembershipFee] = useState("24");
  const [customFee, setCustomFee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("sepa");
  const [menuOpen, setMenuOpen] = useState(false);
  const [memberLoginOpen, setMemberLoginOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [memberLoginError, setMemberLoginError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formError, setFormError] = useState("");

  const [showSatzung, setShowSatzung] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFormError("");

    const form = e.currentTarget;

    if (membershipFee === "custom" && Number(customFee) < 24) {
      setFormError("Der eigene Jahresbeitrag muss mindestens 24 € betragen.");
      return;
    }

    const formData = new FormData(form);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      birthDate: formData.get("birthDate"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      street: formData.get("street"),
      zip: formData.get("zip"),
      city: formData.get("city"),
      childName: formData.get("childName"),
      childGroup: formData.get("childGroup"),
      membershipFee,
      customFee,
      paymentMethod,
      accountHolder: formData.get("accountHolder"),
      iban: formData.get("iban"),
      message: formData.get("message"),
    };

    const response = await fetch("/api/membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setFormError(
        result.message || "Mitgliedsantrag konnte nicht übermittelt werden."
      );
      return;
    }

    setShowSuccessModal(true);

    form.reset();
    setMembershipFee("24");
    setCustomFee("");
    setPaymentMethod("sepa");
  }

  async function handleMemberLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMemberLoginError("");

    const response = await fetch("/api/member/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: memberEmail,
        password: memberPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMemberLoginError(result.message || "Login fehlgeschlagen.");
      return;
    }

    if (result.mustChangePassword) {
      window.location.href = "/mitglieder/passwort-aendern";
      return;
    }

    window.location.href = "/mitglieder";
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#2f2f2f]">
      <header className="sticky top-0 z-50 border-b border-[#ece6dc] bg-[#f8f5ee]/95 backdrop-blur">
        <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 lg:px-16">
          <Image
            src="/images/logo.png"
            alt="Förderverein Kita am BiZ"
            width={260}
            height={100}
            className="h-16 w-auto object-contain sm:h-20 lg:h-24"
            priority
          />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-10 md:flex">
            <a href="#projekte" className="font-medium text-[#3f6f55]">
              Projekte
            </a>

            <a href="/spenden" className="font-medium text-[#3f6f55]">
              Spenden
            </a>

            <a href="#kontakt" className="font-medium text-[#3f6f55]">
              Kontakt
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8cfc3] bg-white text-[#3f6f55] md:hidden"
            aria-label="Menü öffnen"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMemberLoginOpen(!memberLoginOpen)}
                className="rounded-full border border-[#d8cfc3] bg-white px-6 py-3 text-sm font-semibold text-[#3f6f55] transition hover:border-[#3f6f55]"
              >
                Mitgliederbereich
              </button>

              {memberLoginOpen && (
                <div className="absolute right-0 top-16 z-50 w-80 rounded-[28px] bg-white p-6 shadow-2xl">
                  <h3 className="mb-4 text-lg font-semibold text-[#3f6f55]">
                    Mitglieder Login
                  </h3>

                  <form onSubmit={handleMemberLogin} className="space-y-3">
                    <input
                      type="email"
                      placeholder="E-Mail-Adresse"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#ddd4c8] px-4 py-3"
                      required
                    />

                    <input
                      type="password"
                      placeholder="Passwort"
                      value={memberPassword}
                      onChange={(e) => setMemberPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#ddd4c8] px-4 py-3"
                      required
                    />

                    {memberLoginError && (
                      <p className="text-sm text-red-600">
                        {memberLoginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#3f6f55] py-3 font-semibold text-white transition hover:bg-[#335945]"
                    >
                      Anmelden
                    </button>

                    <Link
                      href="/mitglieder/passwort-vergessen"
                      className="block text-center text-sm text-[#3f6f55] hover:underline"
                    >
                      Passwort vergessen?
                    </Link>
                  </form>
                </div>
              )}
            </div>

            <a
              href="#beitritt"
              className="rounded-full bg-[#3f6f55] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#335945]"
            >
              Mitglied werden
            </a>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#ece6dc] bg-[#f8f5ee] px-4 py-5 md:hidden">
            <nav className="flex flex-col gap-4">
              <a
                onClick={() => setMenuOpen(false)}
                href="#projekte"
                className="rounded-2xl bg-white px-5 py-4 font-medium text-[#3f6f55]"
              >
                Projekte
              </a>

              <a
                onClick={() => setMenuOpen(false)}
                href="/spenden"
                className="rounded-2xl bg-white px-5 py-4 font-medium text-[#3f6f55]"
              >
                Spenden
              </a>

              <a
                onClick={() => setMenuOpen(false)}
                href="#kontakt"
                className="rounded-2xl bg-white px-5 py-4 font-medium text-[#3f6f55]"
              >
                Kontakt
              </a>

              <a
                onClick={() => setMenuOpen(false)}
                href="#beitritt"
                className="rounded-2xl bg-[#3f6f55] px-5 py-4 font-semibold text-white"
              >
                Mitglied werden
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[82vh] overflow-hidden md:min-h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/Hero-Banner-2.jpg"
            alt="Förderverein Kita"
            className="h-full w-full object-cover object-center md:object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5ee]/95 via-[#f8f5ee]/20 to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-[90vh] items-center px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#8daa91]">
              Förderverein Kita am BiZ
            </p>

            <h1
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-6 text-5xl font-bold leading-[0.95] text-[#3f6f55] sm:text-6xl md:text-8xl"
            >
              Gemeinsam mehr
              <br />
              für unsere Kinder
            </h1>

            <p className="mb-8 text-lg leading-8 text-[#555]">
              Wir unterstützen Projekte, Anschaffungen und besondere Erlebnisse,
              die den Kita-Alltag bereichern und den Kindern direkt
              zugutekommen.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row [&>a]:w-full sm:[&>a]:w-auto">
              <a
                href="#beitritt"
                className="rounded-full bg-[#8daa91] px-8 py-4 font-semibold text-white shadow-md transition hover:-translate-y-1 hover:bg-[#78987d]"
              >
                Mitglied werden
              </a>

              <a
                href="#projekte"
                className="rounded-full border border-[#b7a6d9] bg-white px-8 py-4 font-semibold text-[#6f5ca8] shadow-md transition hover:-translate-y-1 hover:bg-[#6f5ca8] hover:text-white"
              >
                Projekte ansehen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WAS WIR FÖRDERN */}
      <section id="foerderung" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#8daa91]">
              Was wir fördern
            </p>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-6 text-5xl font-bold text-[#3f6f55]"
            >
              Gemeinsam schaffen wir mehr
            </h2>

            <p className="text-lg leading-8 text-[#666]">
              Durch Mitgliedsbeiträge, Spenden und Aktionen ermöglichen wir
              Projekte und Anschaffungen, die den Kita-Alltag bereichern und den
              Kindern zugutekommen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Kreativmaterial",
                text: "Farben, Papier, Bastelmaterialien und kreative Projekte für die tägliche Förderung der Kinder.",
                image: "/images/kreativmaterial.jpg",
              },
              {
                title: "Außengelände",
                text: "Neue Spielgeräte, Hochbeete und spannende Möglichkeiten zum Entdecken und Bewegen.",
                image: "/images/aussenbereich.jpg",
              },
              {
                title: "Ausflüge",
                text: "Besuche im Theater, Museen oder besondere Erlebnisse außerhalb der Kita.",
                image: "/images/ausfluege.jpg",
              },
              {
                title: "Feste & Aktionen",
                text: "Sommerfeste, Adventsaktionen und besondere Veranstaltungen für Kinder und Familien.",
                image: "/images/party.jpg",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[32px] border border-[#ece6dc] bg-[#f8f5ee] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-56 overflow-hidden bg-[#eaf2ea]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-8 text-center">
                  <h3
                    style={{ fontFamily: "var(--font-baloo)" }}
                    className="mb-4 text-3xl font-bold text-[#3f6f55]"
                  >
                    {item.title}
                  </h3>

                  <p className="leading-7 text-[#666]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projekte" className="bg-[#efe8dc] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
              Projekte
            </p>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-6 text-5xl font-bold text-[#3f6f55]"
            >
              Das konnten wir bereits unterstützen
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                image: "/images/asb-besuch.jpg",
                title: "ASB-Besuch",
                text: "Spannende Einblicke in die Arbeit des ASB und spielerisches Lernen rund um Erste Hilfe.",
              },
              {
                image: "/images/hochbeet.jpg",
                title: "Hochbeet",
                text: "Gemeinsam pflanzen, pflegen und erleben die Kinder Natur hautnah.",
              },
              {
                image: "/images/taschentuecher.jpg",
                title: "Taschentücher",
                text: "Eine kleine Unterstützung mit großer Wirkung für den Kita-Alltag.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[32px] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="h-72 overflow-hidden sm:h-80">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={500}
                    className={`h-full w-full object-cover ${
                      item.title === "Taschentücher"
                        ? "object-[center_80%]"
                        : "object-center"
                    }`}
                  />
                </div>

                <div className="p-8 text-center">
                  <h3
                    style={{ fontFamily: "var(--font-baloo)" }}
                    className="mb-4 text-3xl font-bold text-[#3f6f55]"
                  >
                    {item.title}
                  </h3>

                  <p className="leading-8 text-[#666]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="beitritt"
        className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Mitglied werden
          </p>

          <h2
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-6 text-5xl font-bold text-[#3f6f55]"
          >
            Online-Beitrittsformular
          </h2>

          <p className="text-lg leading-8 text-[#555]">
            Mit deiner Mitgliedschaft unterstützt du Projekte und Anschaffungen,
            die direkt den Kindern unserer Kita zugutekommen.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] bg-white p-5 shadow-xl sm:p-8 md:rounded-[36px] md:p-12"
        >
          <div className="space-y-12">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Persönliche Daten
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <input
                  name="firstName"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="Vorname *"
                  required
                />

                <input
                  name="lastName"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="Nachname *"
                  required
                />

                <input
                  name="birthDate"
                  type="text"
                  className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="Geburtsdatum"
                  required
                />

                <input
                  name="email"
                  type="email"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="E-Mail *"
                  required
                />

                <input
                  name="phone"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="Telefon"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Anschrift
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <input
                  name="street"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4 md:col-span-2"
                  placeholder="Straße und Hausnummer *"
                  required
                />

                <input
                  name="zip"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="PLZ *"
                  required
                />

                <input
                  name="city"
                  className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                  placeholder="Ort *"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Mitgliedschaft
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    value: "24",
                    title: "24 €",
                    text: "Regulärer Jahresbeitrag",
                  },
                  {
                    value: "custom",
                    title: "Eigener Beitrag",
                    text: "Mindestens 24 € pro Jahr",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMembershipFee(option.value)}
                    className={`rounded-3xl border p-6 text-left transition ${
                      membershipFee === option.value
                        ? "border-[#8daa91] bg-[#eaf2ea] shadow-md"
                        : "border-[#ddd4c8] bg-white hover:border-[#8daa91]"
                    }`}
                  >
                    <p className="text-2xl font-bold text-[#3f6f55]">
                      {option.title}
                    </p>
                    <p className="mt-2 text-sm text-[#666]">{option.text}</p>
                  </button>
                ))}
              </div>

              {membershipFee === "custom" && (
                <div className="mt-6">
                  <input
                    type="number"
                    min="24"
                    step="1"
                    value={customFee}
                    onChange={(e) => setCustomFee(e.target.value)}
                    placeholder="Eigener Jahresbeitrag in €"
                    className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4"
                    required
                  />

                  <p className="mt-2 text-sm text-[#666]">
                    Der Jahresbeitrag muss mindestens 24 € betragen.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Zahlungsart
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    value: "sepa",
                    title: "SEPA-Lastschrift",
                    text: "Der Beitrag wird bequem eingezogen.",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentMethod(option.value)}
                    className={`rounded-3xl border p-6 text-left transition ${
                      paymentMethod === option.value
                        ? "border-[#8daa91] bg-[#eaf2ea] shadow-md"
                        : "border-[#ddd4c8] bg-white hover:border-[#8daa91]"
                    }`}
                  >
                    <p className="text-2xl font-bold text-[#3f6f55]">
                      {option.title}
                    </p>
                    <p className="mt-2 text-sm text-[#666]">{option.text}</p>
                  </button>
                ))}
              </div>

              {paymentMethod === "sepa" && (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <input
                    name="accountHolder"
                    className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                    placeholder="Kontoinhaber *"
                    required
                  />

                  <input
                    name="iban"
                    className="rounded-2xl border border-[#ddd4c8] px-5 py-4"
                    placeholder="IBAN *"
                    required
                  />

                  <label className="flex gap-3 text-sm leading-6 text-[#555] md:col-span-2">
                    <input type="checkbox" className="mt-1 h-5 w-5" required />
                    Ich ermächtige den Förderverein widerruflich, den
                    Mitgliedsbeitrag per SEPA-Lastschrift von meinem Konto
                    einzuziehen.
                  </label>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Kommunikation
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-[#ddd4c8] p-4">
                  <input type="checkbox" className="h-5 w-5" />
                  Newsletter erhalten
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#ddd4c8] p-4">
                  <input type="checkbox" className="h-5 w-5" />
                  Informationen per E-Mail erhalten
                </label>
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Nachricht
              </h3>

              <textarea
                name="message"
                className="min-h-32 w-full rounded-2xl border border-[#ddd4c8] px-5 py-4"
                placeholder="Nachricht oder Hinweis"
              />
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold text-[#3f6f55]">
                Zustimmung
              </h3>

              <div className="space-y-4">
                <label className="flex gap-3 text-sm leading-6 text-[#555]">
                  <input type="checkbox" className="mt-1 h-5 w-5" required />
                  <span>
                    Ich erkenne die{" "}
                    <button
                      type="button"
                      onClick={() => setShowSatzung(true)}
                      className="font-semibold text-[#3f6f55] underline underline-offset-2 transition hover:text-[#335945]"
                    >
                      Satzung
                    </button>{" "}
                    des Fördervereins an.
                  </span>
                </label>

                <label className="flex gap-3 text-sm leading-6 text-[#555]">
                  <input type="checkbox" className="mt-1 h-5 w-5" required />
                  <span>
                    Ich habe die{" "}
                    <button
                      type="button"
                      onClick={() => setShowDatenschutz(true)}
                      className="font-semibold text-[#3f6f55] underline underline-offset-2 transition hover:text-[#335945]"
                    >
                      Datenschutzerklärung
                    </button>{" "}
                    gelesen.
                  </span>
                </label>

                <label className="flex gap-3 text-sm leading-6 text-[#555]">
                  <input type="checkbox" className="mt-1 h-5 w-5" required />
                  <span>
                    Ich stimme zu, dass meine Angaben zur Bearbeitung meines
                    Beitritts gespeichert und verarbeitet werden.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {formError && (
            <div className="mt-8 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="mt-10 w-full rounded-full bg-[#8daa91] px-10 py-4 font-semibold text-white transition hover:bg-[#78987d] sm:w-auto"
          >
            Beitritt absenden
          </button>
        </form>
      </section>

      <footer className="mt-24 rounded-t-[40px] bg-[#2f4f3d] text-white">
        <div className="mx-auto max-w-7xl px-8 py-16">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-2xl font-bold">
                Förderverein Kita am BiZ e. V.
              </h3>

              <p className="leading-7 text-[#d8e3d5]">
                Gemeinsam für unsere Kinder. Unterstützung von Projekten,
                Veranstaltungen und Anschaffungen für die Kita am BiZ.
              </p>
            </div>

            <div>
              <h4 id="kontakt" className="mb-4 text-lg font-semibold">
                Kontakt
              </h4>

              <ul className="space-y-3 text-[#d8e3d5]">
                <li>Von-Steuben-Straße 31</li>
                <li>67549 Worms</li>
                <li>info@foerderverein-kita-am-biz.de</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Verein</h4>

              <div className="flex flex-col gap-3">
                <a
                  href="#beitritt"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Mitglied werden
                </a>

                <Link
                  href="/spenden"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Spenden
                </Link>

                <Link
                  href="/satzung"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Satzung
                </Link>

                <a
                  href="#projekte"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Projekte
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">
                Mitglieder & Rechtliches
              </h4>

              <div className="flex flex-col gap-3">
                <Link
                  href="/mitglieder/login"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Mitgliederbereich
                </Link>

                <Link
                  href="/datenschutz"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Datenschutz
                </Link>

                <Link
                  href="/impressum"
                  className="text-[#d8e3d5] transition hover:text-[#d4a84f]"
                >
                  Impressum
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-[#d8e3d5]">
            <p>© {new Date().getFullYear()} Förderverein Kita am BiZ e. V.</p>

            <p className="mt-2">
              Vereinsregister: VR 42662 · Amtsgericht Mainz
            </p>

            <p className="mt-2">
              Vertreten durch den Vorstand: Matthias Dengler · Mario Mai ·
              Johanna Ehses
            </p>
          </div>
        </div>
      </footer>

      {showSatzung && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl md:p-10">
            <button
              type="button"
              onClick={() => setShowSatzung(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f5ee] text-2xl font-bold text-[#3f6f55] transition hover:bg-[#e8dfd1]"
              aria-label="Satzung schließen"
            >
              ×
            </button>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-8 pr-12 text-4xl font-bold text-[#3f6f55]"
            >
              Satzung Förderverein Kita am BIZ
            </h2>

            <div className="space-y-8 text-sm leading-7 text-[#444] md:text-base">
              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 1 Name, Sitz und Geschäftsjahr
                </h3>

                <p>
                  (1) Der Verein führt den Namen „Förderverein Kita am BIZ“. Er soll
                  in das Vereinsregister eingetragen werden und führt dann den Zusatz
                  „e. V.“
                </p>

                <p>(2) Sitz des Vereins ist Worms.</p>

                <p>(3) Geschäftsjahr ist das Kalenderjahr.</p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 2 Zweck des Vereins
                </h3>

                <p>
                  (1) Der Satzungszweck des Vereins ist die ideelle und materielle
                  Förderung der Kindertagesstätte „Kita am BIZ“ in Worms nach § 58 Nr.
                  1 AO und er wird insbesondere verwirklicht durch:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    die Unterstützung der pädagogischen Arbeit der Kindertagesstätte,
                    insbesondere durch Förderung von Projekten, Veranstaltungen und
                    Bildungsangeboten;
                  </li>

                  <li>
                    die Beschaffung und Bereitstellung von finanziellen Mitteln, die
                    der Kindertagesstätte für Anschaffungen, Ausstattungen im Innen-
                    und Außenbereich, Lehr- und Spielmaterial zugutekommen;
                  </li>

                  <li>
                    die Förderung von Gemeinschaft und Zusammenarbeit zwischen
                    Kindern, Eltern, Erzieherinnen und Erziehern sowie dem Träger der
                    Einrichtung, insbesondere durch die Durchführung oder
                    Unterstützung von Veranstaltungen;
                  </li>

                  <li>
                    die Unterstützung bedürftiger Kinder der Einrichtung durch
                    Zuschüsse zu Ausflügen, Projekten oder besonderen Anschaffungen;
                  </li>

                  <li>
                    die Durchführung eigener Veranstaltungen, wie Basare, Feste,
                    Spendenaktionen und Sammelaktionen, deren Erlöse der Förderung
                    der Kindertagesstätte dienen;
                  </li>

                  <li>die Unterstützung beim Betrieb einer Kita-Bibliothek.</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 3 Mittelverwendung
                </h3>

                <p>
                  (1) Der Verein verfolgt ausschließlich und unmittelbar gemeinnützige
                  Zwecke im Sinne des § 52 Abs. 2 Nr. 7 AO Förderung der Erziehung.
                </p>

                <p>
                  (2) Der Verein ist selbstlos tätig. Er verfolgt nicht in erster Linie
                  eigene wirtschaftliche Zwecke. Mittel des Vereins dürfen nur für
                  satzungsgemäße Zwecke verwendet werden.
                </p>

                <p>
                  (3) Die Mitglieder des Vereins erhalten keine Zuwendungen aus
                  Mitteln des Vereins.
                </p>

                <p>
                  (4) Es darf keine Person durch Ausgaben, die dem Zweck des Vereins
                  fremd sind, oder durch unverhältnismäßig hohe Vergütungen begünstigt
                  werden. Die Vereinsämter werden grundsätzlich ehrenamtlich ausgeübt.
                  Aufwendungen, die den Mitgliedern im Rahmen ihrer Tätigkeit für den
                  Verein entstehen, können erstattet werden.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 4 Mitgliedschaft
                </h3>

                <p>
                  (1) Jede volljährige natürliche Person und juristische Person
                  öffentlichen und privaten Rechts kann Mitglied des Vereins werden.
                </p>

                <p>
                  (2) Zu Ehrenmitgliedern können Personen ernannt werden, die sich in
                  besonderer Weise um die Ziele des Vereins verdient gemacht haben.
                  Ehrenmitglieder werden vom Vorstand nach § 26 BGB vorgeschlagen und
                  sind von der nächsten Mitgliederversammlung zu bestätigen. Sie sind
                  von der Beitragszahlung befreit und sind beratend tätig, haben jedoch
                  kein Stimmrecht auf der Mitgliederversammlung.
                </p>

                <p>
                  (3) Die Mitgliedschaft ist in Schriftform zu beantragen. Über den
                  Antrag entscheidet der Vorstand. Im Fall der Ablehnung eines
                  Aufnahmeantrags ist der Vorstand nicht verpflichtet, dem/der
                  Antragsteller/in die Gründe mitzuteilen.
                </p>

                <p>
                  (4) Die Mitgliedschaft endet durch Tod des Mitglieds, Austritt,
                  Ausschluss und bei Verlust der Rechtsfähigkeit der juristischen
                  Person.
                </p>

                <p>
                  (5) Der Austritt erfolgt durch Erklärung in Textform gegenüber
                  dem/der 1. Vorsitzenden. Er ist nur zum Schluss des Geschäftsjahres
                  zulässig. Im Falle der Beendigung der Mitgliedschaft besteht kein
                  Anspruch auf eine anteilige Erstattung des entrichteten
                  Jahresbeitrags.
                </p>

                <p>
                  (6) Der Ausschluss eines Mitgliedes kann nur durch Beschluss des
                  Vorstands erfolgen, wenn das Mitglied in erheblichem Maße gegen den
                  Zweck des Vereins verstoßen hat, dessen Ansehen schädigt oder mit
                  einem Jahresbeitrag im Verzug ist. Vor dem Ausschluss ist das
                  betroffene Mitglied über den Ausschluss persönlich oder in Textform
                  zu informieren. Das ausgeschlossene Mitglied kann gegen die
                  Entscheidung Berufung einlegen, über die die Mitgliederversammlung
                  entscheidet. Bis dahin ruht die Mitgliedschaft des Mitglieds.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 5 Mitgliedsbeitrag
                </h3>

                <p>
                  (1) Von den Mitgliedern werden Beiträge erhoben. Die Höhe der
                  Jahresbeiträge und deren Fälligkeit werden von der
                  Mitgliederversammlung in einer Beitragsordnung festgelegt.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 6 Organe des Vereins
                </h3>

                <p>(1) Die Organe des Vereins sind:</p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>die Mitgliederversammlung</li>
                  <li>der Vorstand</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 7 Vorstand
                </h3>

                <p>
                  (1) Der Vorstand besteht aus bis zu 8 von der Mitgliederversammlung
                  zu wählenden Mitgliedern, nämlich:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>1. Vorsitzende(n),</li>
                  <li>2. Vorsitzende(n),</li>
                  <li>Schatzmeister(in),</li>
                  <li>Schriftführer(in) optional,</li>
                  <li>bis zu 4 Beisitzer(innen) optional.</li>
                </ul>

                <p>
                  (2) Die Vorstandsmitglieder werden für die Dauer von 2 Jahren
                  gewählt. Wiederwahl ist zulässig.
                </p>

                <p>
                  (3) Die gewählten Vorstandsmitglieder bleiben auch nach Ablauf der
                  Wahlperiode im Amt, bis die Mitgliederversammlung einen neuen
                  Vorstand wählt.
                </p>

                <p>
                  (4) Mit Beendigung der Mitgliedschaft im Verein endet auch das Amt
                  als Vorstandsmitglied.
                </p>

                <p>
                  (5) Vorstand im Sinne des § 26 BGB sind der/die 1. Vorsitzende,
                  der/die 2. Vorsitzende und der/die Schatzmeister(in). Sie vertreten
                  jeweils zu zweien gemeinsam.
                </p>

                <p>(6) Der Vorstand ist für alle Angelegenheiten des Vereins zuständig.</p>

                <p>Zu seinen Aufgaben zählen insbesondere:</p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Führung der laufenden Geschäfte;</li>
                  <li>
                    Vorbereitung und Einberufung der Mitgliederversammlung sowie
                    Aufstellung der Tagesordnung;
                  </li>
                  <li>Ausführung von Beschlüssen der Mitgliederversammlung;</li>
                  <li>
                    Vorbereitung eines etwaigen Haushaltsplans, Buchführung,
                    Erstellung des Jahresberichts, Vorlage der Jahresplanung;
                  </li>
                  <li>
                    Beschlussfassung über Aufnahmeanträge und Ausschlüsse von
                    Mitgliedern;
                  </li>
                  <li>
                    Auswahl und Aufsicht der für den Verein tätigen Personen, zum
                    Beispiel Honorarkräfte;
                  </li>
                </ul>

                <p>
                  (7) Der Vorstand beschließt in Sitzungen, die von einem Mitglied des
                  vertretungsberechtigten Vorstands einberufen werden. Der Vorstand
                  ist beschlussfähig, wenn mindestens die Hälfte seiner Mitglieder
                  anwesend ist. Der Vorstand fasst seine Beschlüsse mit einfacher
                  Mehrheit; jedes Mitglied hat eine Stimme. Vorstandsbeschlüsse können
                  auch im Umlaufverfahren oder per E-Mail/Messenger gefasst werden.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 8 Mitgliederversammlung
                </h3>

                <p>
                  (1) Oberstes Organ ist die Mitgliederversammlung, die jährlich
                  durchzuführen ist.
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Die Einladung erhalten die Mitglieder in Textform zwei Wochen vor
                    der Mitgliederversammlung unter Angabe der Tagesordnung.
                  </li>

                  <li>
                    Anträge zur Tagesordnung sind spätestens eine Woche vor der
                    Mitgliederversammlung schriftlich oder in Textform bei dem oder
                    der Vorsitzenden einzureichen.
                  </li>

                  <li>
                    Eine außerordentliche Mitgliederversammlung wird einberufen, wenn
                    mindestens ein Viertel der Mitglieder dies beantragt.
                  </li>
                </ul>

                <p>
                  (2) Die Mitgliederversammlung wird von der/dem Vorsitzenden oder
                  einem anderen Vorstandsmitglied geleitet, soweit die Versammlung
                  keine andere Person bestimmt.
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Jede ordnungsgemäß einberufene Mitgliederversammlung ist
                    beschlussfähig. Sie beschließt über Anträge mit einfacher Mehrheit
                    der abgegebenen gültigen Stimmen, soweit die Satzung nicht anderes
                    bestimmt.
                  </li>

                  <li>
                    Gewählt wird in offener Abstimmung. Wird von einem Viertel der
                    anwesenden stimmberechtigten Mitglieder die geheime Wahl verlangt,
                    muss die Abstimmung geheim erfolgen.
                  </li>

                  <li>
                    Jedes Mitglied hat eine Stimme. Die Vertretung eines Mitglieds
                    durch ein anderes Mitglied ist mittels schriftlicher Vollmacht
                    zulässig. Ein Mitglied kann maximal ein anderes Mitglied
                    vertreten.
                  </li>

                  <li>
                    Werden auf einer Mitgliederversammlung Dringlichkeitsanträge
                    gestellt, beschließt die Versammlung zunächst mit
                    Zwei-Drittel-Mehrheit über die Dringlichkeit. Bei Bestätigung der
                    Dringlichkeit kann über den Antrag in der Versammlung beraten und
                    beschlossen werden.
                  </li>

                  <li>
                    Für Wahlen gilt Folgendes: Hat im ersten Wahlgang keine der
                    kandidierenden Personen die absolute Mehrheit der abgegebenen
                    Stimmen erreicht, findet eine Stichwahl zwischen den beiden
                    Personen statt, welche die höchsten Stimmzahlen erreicht haben.
                    Gewählt ist dann die Person, welche die meisten Stimmen auf sich
                    vereinigt. Bei Stimmengleichheit in der Stichwahl findet ein
                    weiterer Wahlgang statt. Besteht auch dann Stimmengleichheit,
                    entscheidet das Los des Vorsitzenden.
                  </li>

                  <li>
                    Eine Blockwahl kann beschlossen werden, wenn Anzahl der Kandidaten
                    und Anzahl zu besetzende Rollen identisch ist.
                  </li>

                  <li>
                    Beschlüsse werden mit einfacher Mehrheit der abgegebenen gültigen
                    Stimmen gefasst.
                  </li>
                </ul>

                <p>(3) Zu den Aufgaben der Mitgliederversammlung gehören insbesondere:</p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Entgegennahme der Berichte des Vorstandes wie Geschäftsbericht und
                    Kassenbericht sowie Bericht über die Kassenprüfung;
                  </li>
                  <li>Entscheidung über die Entlastung des Vorstandes;</li>
                  <li>Wahl des Vorstandes;</li>
                  <li>Wahl der Kassenprüfer(innen);</li>
                  <li>Bestätigung der Ernennung von Ehrenmitgliedern;</li>
                  <li>Festsetzung der Mindesthöhe des Mitgliedsbeitrags;</li>
                  <li>Änderung der Satzung;</li>
                  <li>Auflösung des Vereins.</li>
                </ul>

                <p>
                  (4) Über die Mitgliederversammlung und deren Beschlüsse ist ein
                  Protokoll anzufertigen, das von der Protokollführung und der
                  Versammlungsleitung zu unterschreiben ist.
                </p>

                <p>
                  (5) Beschlüsse der Mitgliederversammlung können auch im
                  Umlaufverfahren gefasst werden, wenn alle Mitglieder in Textform
                  beteiligt wurden und bis zu dem vom Vorstand gesetzten Termin
                  mindestens die Hälfte der Mitglieder ihre Stimme in Textform
                  abgegeben hat.
                </p>

                <p>
                  (6) Weitere Einzelheiten zum Ablauf der Mitgliederversammlung können
                  in einer „Geschäftsordnung für die Mitgliederversammlung“ geregelt
                  werden.
                </p>

                <p>(7) Virtuelle und hybride Mitgliederversammlung</p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Der Vorstand kann beschließen, dass die Mitglieder an der
                    Mitgliederversammlung ohne Anwesenheit an einem Versammlungsort im
                    Wege der elektronischen Kommunikation teilnehmen und andere
                    Mitgliedsrechte ausüben können, hybride Mitgliederversammlung,
                    oder müssen, virtuelle Versammlung.
                  </li>

                  <li>
                    Wird eine hybride oder virtuelle Versammlung einberufen, so muss
                    in der Einladung auch angegeben werden, wie die Mitglieder ihre
                    Rechte im Wege der elektronischen Kommunikation ausüben können.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 9 Kassenprüfung
                </h3>

                <p>
                  (1) Die Kasse und die Rechnungslegung des Vereins werden mindestens
                  einmal im Jahr von wenigstens zwei Personen geprüft, die hierzu von
                  der Mitgliederversammlung für jeweils zwei Geschäftsjahre zu wählen
                  sind. Die Kassenprüfer(innen) dürfen weder Mitglieder des Vorstandes
                  noch Angestellte des Vereins sein.
                </p>

                <p>
                  (2) Sie erstatten in der dem Geschäftsjahr folgenden
                  Mitgliederversammlung Bericht und empfehlen bei ordnungsgemäßer
                  Kassenführung der Mitgliederversammlung die Entlastung des
                  Vorstands.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 10 Satzungsänderungen
                </h3>

                <p>
                  (1) Eine Satzungsänderung kann nur beschlossen werden, wenn sie bei
                  der Einberufung zur Mitgliederversammlung als Tagesordnungspunkt
                  gesondert aufgeführt ist.
                </p>

                <p>
                  (2) Eine Satzungsänderung oder die Änderung des Vereinszwecks bedarf
                  einer Zwei-Drittel-Mehrheit der abgegebenen gültigen Stimmen.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 11 Vermögen, Finanzierung des Vereins
                </h3>

                <p>
                  (1) Dem Vorstand obliegt die treuhänderische Verwaltung des
                  Vereinsvermögens.
                </p>

                <p>(2) Geldmittel sind auf einem Bankkonto zu verwalten.</p>

                <p>
                  (3) Der Verein erhebt von seinen Mitgliedern jährliche Beiträge. Die
                  Höhe der Beiträge, die Zahlungsmodalitäten und sonstige Einzelheiten
                  der Mitgliedsbeiträge werden in einer gesonderten Beitragsordnung
                  geregelt.
                </p>

                <p>
                  (4) Spenden und die dazugehörigen personenbezogenen Daten werden
                  nach den Vorgaben der Datenschutz-Grundverordnung DSGVO vertraulich
                  behandelt.
                </p>

                <p>(5) Fördermaßnahmen des Vereins werden unter anderem finanziert aus:</p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Mitgliedsbeiträgen</li>
                  <li>Erlösen aus Aktivitäten des Vereins</li>
                  <li>Spenden</li>
                </ul>

                <p>
                  (6) Es dürfen keine Verbindlichkeiten eingegangen werden, die die
                  Mittel des Vereins übersteigen. Die Beleihung des Vereinsvermögens
                  ist untersagt.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 12 Auflösung des Vereins und Anfall des Vereinsvermögens
                </h3>

                <p>
                  (1) Die Auflösung des Vereins kann nur von einer zu diesem Zweck
                  einberufenen außerordentlichen Mitgliederversammlung mit
                  Drei-Viertel-Mehrheit der abgegebenen gültigen Stimmen beschlossen
                  werden.
                </p>

                <p>
                  (2) Bei Auflösung des Vereins oder bei Wegfall der
                  steuerbegünstigten Zwecke fällt das Vermögen des Vereins an Klinikum
                  Worms gGmbH Abteilung Kinderklinik, der es unmittelbar und
                  ausschließlich für gemeinnützige Zwecke zu verwenden hat.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  § 13 Inkrafttreten
                </h3>

                <p>
                  (1) Vorstehende Satzung wurde am 19.02.2026 in Worms von der
                  Gründungsversammlung beschlossen und tritt sofort in Kraft.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {showDatenschutz && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl md:p-10">
            <button
              type="button"
              onClick={() => setShowDatenschutz(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f5ee] text-2xl font-bold text-[#3f6f55] transition hover:bg-[#e8dfd1]"
              aria-label="Datenschutzerklärung schließen"
            >
              ×
            </button>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-8 pr-12 text-4xl font-bold text-[#3f6f55]"
            >
              Datenschutzhinweise nach Art. 13 DSGVO
            </h2>

            <div className="space-y-8 text-sm leading-7 text-[#444] md:text-base">
              <section>
                <p className="text-lg font-semibold text-[#3f6f55]">
                  Für Mitglieder und Interessierte des Fördervereins Kita am BIZ e. V.
                </p>

                <p className="mt-3">
                  Diese Hinweise informieren darüber, wie der Förderverein
                  personenbezogene Daten verarbeitet, wenn Daten direkt bei der
                  betroffenen Person erhoben werden, zum Beispiel bei Beitritt oder
                  Kontaktaufnahme.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  1. Verantwortlicher
                </h3>

                <p>Förderverein Kita am BIZ</p>

                <p>Vertreten durch den Vorstand: Matthias Dengler</p>

                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:info@foerderverein-kita-am-biz.de"
                    className="font-semibold text-[#3f6f55] underline underline-offset-2"
                  >
                    info@foerderverein-kita-am-biz.de
                  </a>
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  2. Datenschutzkontakt
                </h3>

                <p>Ein Datenschutzbeauftragter ist nicht bestellt.</p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  3. Zwecke und Rechtsgrundlagen der Verarbeitung
                </h3>

                <p>
                  Wir verarbeiten personenbezogene Daten insbesondere für folgende
                  Zwecke:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Mitgliederverwaltung, insbesondere Aufnahme, Bestandspflege,
                    Kontakt, Beitragsstatus sowie Funktionen und Ämter.
                  </li>

                  <li>
                    Beitragswesen und Buchhaltung, insbesondere Beitrags- bzw.
                    Spendenabwicklung, Zahlungsabgleich, Nachweise und gegebenenfalls
                    Spendenquittungen.
                  </li>

                  <li>
                    Vereinskommunikation, insbesondere Einladungen zu
                    Mitgliederversammlungen sowie Informationen zu
                    Vereinsveranstaltungen und Events.
                  </li>

                  <li>
                    Fotoaufnahmen bei Festen und Veranstaltungen, nur mit gesonderter
                    Einwilligung, die separat eingeholt wird, zum Aushang in der Kita
                    und zur Veröffentlichung auf der vereinseigenen Homepage.
                  </li>
                </ul>

                <p className="mt-5 font-semibold text-[#3f6f55]">
                  Rechtsgrundlagen:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Art. 6 Abs. 1 lit. b DSGVO, Mitgliedschaft/Vertrag</li>
                  <li>Art. 6 Abs. 1 lit. c DSGVO, rechtliche Verpflichtung</li>
                  <li>Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse</li>
                  <li>
                    Art. 6 Abs. 1 lit. a DSGVO, Einwilligung, insbesondere für
                    Fotoaufnahmen
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  4. Welche Daten verarbeiten wir?
                </h3>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Stammdaten: Name, Anschrift, Geburtsdatum.</li>

                  <li>
                    Kontaktdaten: E-Mail-Adresse, Telefonnummer optional.
                  </li>

                  <li>
                    Zahlungsdaten: IBAN, BIC, SEPA-Lastschriftmandat.
                  </li>

                  <li>
                    Mitgliedschaftsdaten: Eintritt, Austritt, Beitragshöhe sowie
                    gegebenenfalls Funktionen im Verein.
                  </li>

                  <li>
                    Kommunikationsdaten: Versand- und Empfangsdaten von E-Mails.
                  </li>

                  <li>
                    Bilddaten: Fotos, gegebenenfalls auch Videos, bei Einwilligung.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  5. Wer erhält Ihre Daten?
                </h3>

                <p>
                  Daten werden nur weitergegeben, wenn dies erforderlich ist oder eine
                  Pflicht besteht.
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Vereinsinterne Stellen: Vorstand, Mitgliederverwaltung und Kassenwart.</li>

                  <li>
                    Bank oder Zahlungsdienstleister zur Durchführung von Lastschriften.
                  </li>

                  <li>
                    Dienstleister, zum Beispiel IT- oder E-Mail-Provider sowie
                    Vereinssoftware.
                  </li>

                  <li>Behörden, zum Beispiel das Finanzamt.</li>

                  <li>
                    Bei Fotoaufnahmen mit Einwilligung: Aushang in der Kita und
                    Veröffentlichung auf der Homepage.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  6. Wie lange speichern wir Ihre Daten?
                </h3>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Mitgliedsdaten: Für die Dauer der Mitgliedschaft; danach nur,
                    soweit dies erforderlich ist.
                  </li>

                  <li>
                    Buchhaltungsunterlagen: gemäß gesetzlichen
                    Aufbewahrungspflichten, zum Beispiel bis zu 10 Jahre.
                  </li>

                  <li>
                    Fotoaufnahmen: bis der Zweck entfällt oder ein Widerruf erfolgt.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  7. Ihre Rechte
                </h3>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Auskunft, Art. 15 DSGVO</li>
                  <li>Berichtigung, Art. 16 DSGVO</li>
                  <li>Löschung oder Einschränkung, Art. 17 und 18 DSGVO</li>
                  <li>Datenübertragbarkeit, Art. 20 DSGVO</li>
                  <li>Widerspruch, Art. 21 DSGVO</li>
                  <li>Widerruf einer Einwilligung, Art. 7 Abs. 3 DSGVO</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  8. Beschwerderecht bei einer Aufsichtsbehörde
                </h3>

                <p>Beispiel Rheinland-Pfalz:</p>

                <div className="mt-3 rounded-2xl bg-[#f8f5ee] p-5">
                  <p className="font-semibold text-[#3f6f55]">
                    Der Landesbeauftragte für den Datenschutz und die
                    Informationsfreiheit Rheinland-Pfalz
                  </p>

                  <p className="mt-2">Postfach 30 40, 55020 Mainz</p>
                  <p>Besucheradresse: Hintere Bleiche 34, 55116 Mainz</p>
                  <p>Telefon: 06131 8920-0</p>

                  <p>
                    E-Mail:{" "}
                    <a
                      href="mailto:poststelle@datenschutz.rlp.de"
                      className="font-semibold text-[#3f6f55] underline underline-offset-2"
                    >
                      poststelle@datenschutz.rlp.de
                    </a>
                  </p>

                  <p>
                    Webseite:{" "}
                    <a
                      href="https://www.datenschutz.rlp.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#3f6f55] underline underline-offset-2"
                    >
                      www.datenschutz.rlp.de
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  9. Pflicht zur Bereitstellung von Daten
                </h3>

                <p>
                  Bestimmte Angaben sind für die Mitgliedschaft erforderlich. Die
                  Einwilligung in Fotoaufnahmen ist freiwillig.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-xl font-bold text-[#3f6f55]">
                  10. Aktualisierung dieser Hinweise
                </h3>

                <p>
                  Wir passen diese Datenschutzhinweise an, wenn sich Verfahren oder
                  Rechtslage ändern.
                </p>

                <p className="mt-4 rounded-2xl bg-[#f8f5ee] p-4 font-semibold text-[#3f6f55]">
                  Stand: 19.02.2026
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
              Vielen Dank
            </p>

            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-4 text-4xl font-bold text-[#3f6f55]"
            >
              Antrag erfolgreich übermittelt
            </h2>

            <p className="mb-8 leading-8 text-[#555]">
              Vielen Dank für dein Interesse am Förderverein Kita am BiZ e. V.
              <br />
              <br />
              Dein Mitgliedsantrag wurde erfolgreich übermittelt und wird nun
              geprüft.
              <br />
              <br />
              Wir melden uns schnellstmöglich bei dir und informieren dich über
              die weiteren Schritte.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </main>
  );
}