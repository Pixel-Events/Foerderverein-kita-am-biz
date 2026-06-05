import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-16 text-[#2f2f2f]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8cfc3] bg-white px-6 py-3 font-semibold text-[#3f6f55] shadow-sm transition hover:border-[#3f6f55]"
        >
          ← Zur Startseite
        </Link>

        <div className="rounded-[36px] bg-white p-8 shadow-xl md:p-12">
          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-8 text-5xl font-bold text-[#3f6f55]"
          >
            Impressum
          </h1>

          <div className="space-y-8 leading-8">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Angaben gemäß § 5 TMG
              </h2>

              <p>
                Förderverein Kita am BiZ e. V.
                <br />
                Von-Steuben-Straße 31
                <br />
                67549 Worms
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Vertreten durch den Vorstand
              </h2>

              <p>
                Matthias Dengler
                <br />
                Mario Mai
                <br />
                Johanna Ehses
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Kontakt
              </h2>

              <p>
                Telefon: 0172 2686580
                <br />
                E-Mail: info@foerderverein-kita-am-biz.de
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Vereinsregister
              </h2>

              <p>
                Vereinsregister: VR 42662
                <br />
                Registergericht: Amtsgericht Mainz
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Verantwortlich für den Inhalt
              </h2>

              <p>
                Matthias Dengler
                <br />
                Förderverein Kita am BiZ e. V.
                <br />
                Von-Steuben-Straße 31
                <br />
                67549 Worms
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Haftung für Inhalte
              </h2>

              <p>
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt.
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                übernehmen wir jedoch keine Gewähr.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                Urheberrecht
              </h2>

              <p>
                Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
                dieser Website unterliegen dem deutschen Urheberrecht.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}