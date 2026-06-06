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

        <form
          onSubmit={handleMemberLogin}
          className="space-y-3"
        >
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={memberEmail}
            onChange={(e) =>
              setMemberEmail(e.target.value)
            }
            className="w-full rounded-xl border border-[#ddd4c8] px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder="Passwort"
            value={memberPassword}
            onChange={(e) =>
              setMemberPassword(e.target.value)
            }
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
        Wir unterstützen Projekte, Anschaffungen und besondere
        Erlebnisse, die den Kita-Alltag bereichern und den Kindern
        direkt zugutekommen.
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
        Projekte und Anschaffungen, die den Kita-Alltag bereichern und
        den Kindern zugutekommen.
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
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-8 text-center">
        <h3
          style={{ fontFamily: "var(--font-baloo)" }}
          className="mb-4 text-3xl font-bold text-[#3f6f55]"
        >
          {item.title}
        </h3>

        <p className="leading-8 text-[#666]">
          {item.text}
        </p>
      </div>
    </div>
  ))}
</div>

      
  
        </div>
      </section>

      <section id="beitritt" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Mitglied werden
          </p>
            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-6 text-5xl font-bold text-[#3f6f55]"
              >Online-Beitrittsformular</h2>
          

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

                <div>
                  <input
                    name="birthdate"
                    type="text"
                    className="w-full rounded-2xl border border-[#ddd4c8] px-5 py-4"
                    placeholder="Geburtsdatum"
                    required
                  />
                </div>

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
                  Ich erkenne die Satzung des Fördervereins an.
                </label>

                <label className="flex gap-3 text-sm leading-6 text-[#555]">
                  <input type="checkbox" className="mt-1 h-5 w-5" required />
                  Ich habe die Datenschutzerklärung gelesen.
                </label>

                <label className="flex gap-3 text-sm leading-6 text-[#555]">
                  <input type="checkbox" className="mt-1 h-5 w-5" required />
                  Ich stimme zu, dass meine Angaben zur Bearbeitung meines
                  Beitritts gespeichert und verarbeitet werden.
                </label>
              </div>
            </div>
          </div>
          {formError && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
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

            {/* Verein */}
            <div>
              <h3 className="mb-4 text-2xl font-bold">
                Förderverein Kita am BiZ e. V.
              </h3>

              <p className="leading-7 text-[#d8e3d5]">
                Gemeinsam für unsere Kinder.
                Unterstützung von Projekten,
                Veranstaltungen und Anschaffungen
                für die Kita am BiZ.
              </p>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">
                Kontakt
              </h4>

              <ul className="space-y-3 text-[#d8e3d5]">
                <li>Von-Steuben-Straße 31</li>
                <li>67549 Worms</li>
                <li>0172 2686580</li>
                <li>info@foerderverein-kita-am-biz.de</li>
              </ul>
            </div>

            {/* Verein */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">
                Verein
              </h4>

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

            {/* Mitglieder & Rechtliches */}
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
            <p>
              © {new Date().getFullYear()} Förderverein Kita am BiZ e. V.
            </p>

            <p className="mt-2">
              Vereinsregister: VR 42662 · Amtsgericht Mainz
            </p>

            <p className="mt-2">
              Vertreten durch den Vorstand:
              Matthias Dengler · Mario Mai · Johanna Ehses
            </p>
          </div>
        </div>
      </footer>

      {showSuccessModal && (
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
            Vielen Dank für Ihr Interesse am Förderverein Kita am BiZ e. V.
            <br />
            <br />
            Ihr Mitgliedsantrag wurde erfolgreich übermittelt und wird nun geprüft.
            <br />
            <br />
            Wir melden uns schnellstmöglich bei Ihnen und informieren Sie über die
            weiteren Schritte.
          </p>

          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full rounded-full bg-[#3f6f55] px-8 py-4 font-semibold text-white transition hover:bg-[#335945]"
          >
            Verstanden
          </button>

        </div>
      )}

    </main>
  );
}