import Link from "next/link";

export default function DatenschutzPage() {
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
            Datenschutz
          </h1>

          <p className="mb-8 text-sm text-[#666]">
            Datenschutzhinweise nach Art. 13 DSGVO für Mitglieder und
            Interessierte des Fördervereins Kita am BIZ e. V.
          </p>

          <div className="space-y-8 leading-8">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                1. Verantwortlicher
              </h2>
              <p>
                Förderverein Kita am BIZ e. V.
                <br />
                Vertreten durch den Vorstand: Matthias Dengler
                <br />
                E-Mail: info@foerderverein-kita-am-biz.de
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                2. Datenschutzkontakt
              </h2>
              <p>Ein Datenschutzbeauftragter ist nicht bestellt.</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                3. Zwecke und Rechtsgrundlagen der Verarbeitung
              </h2>
              <p className="mb-3">
                Wir verarbeiten personenbezogene Daten insbesondere für folgende
                Zwecke:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Mitgliederverwaltung, insbesondere Aufnahme, Bestandspflege,
                  Kontakt, Beitragsstatus sowie Funktionen und Ämter.
                </li>
                <li>
                  Beitragswesen und Buchhaltung, insbesondere Beitrags- und
                  Spendenabwicklung, Zahlungsabgleich, Nachweise und gegebenenfalls
                  Spendenquittungen.
                </li>
                <li>
                  Vereinskommunikation, insbesondere Einladungen zu
                  Mitgliederversammlungen sowie Informationen zu
                  Vereinsveranstaltungen und Events.
                </li>
                <li>
                  Fotoaufnahmen bei Festen und Veranstaltungen nur mit gesonderter
                  Einwilligung, die separat eingeholt wird, zum Aushang in der Kita
                  und zur Veröffentlichung auf der vereinseigenen Homepage.
                </li>
              </ul>

              <p className="mt-4 mb-3">Rechtsgrundlagen:</p>

              <ul className="list-disc space-y-2 pl-6">
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
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                4. Welche Daten verarbeiten wir?
              </h2>

              <ul className="list-disc space-y-2 pl-6">
                <li>Stammdaten: Name, Anschrift, Geburtsdatum.</li>
                <li>
                  Kontaktdaten: E-Mail-Adresse und Telefonnummer, soweit
                  angegeben.
                </li>
                <li>Zahlungsdaten: IBAN, BIC und SEPA-Lastschriftmandat.</li>
                <li>
                  Mitgliedschaftsdaten: Eintritt, Austritt, Beitragshöhe und
                  gegebenenfalls Funktionen im Verein.
                </li>
                <li>
                  Kommunikationsdaten: Versand- und Empfangsdaten von E-Mails.
                </li>
                <li>
                  Bilddaten: Fotos und gegebenenfalls Videos bei vorliegender
                  Einwilligung.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                5. Wer erhält Ihre Daten?
              </h2>

              <p className="mb-3">
                Daten werden nur weitergegeben, wenn dies erforderlich ist oder
                eine gesetzliche Pflicht besteht.
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Vereinsinterne Stellen, insbesondere Vorstand und Kassenwart.</li>
                <li>Banken und Zahlungsdienstleister zur Durchführung von Lastschriften.</li>
                <li>IT-, Hosting- und E-Mail-Dienstleister.</li>
                <li>Behörden, insbesondere das Finanzamt.</li>
                <li>
                  Bei Fotoaufnahmen mit Einwilligung: Aushang in der Kita sowie
                  Veröffentlichung auf der Homepage.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                6. Hosting, Datenbank und Mitgliederbereich
              </h2>

              <p>
                Die Website und der geschützte Mitgliederbereich werden technisch
                über externe Dienstleister betrieben. Dabei können technische
                Daten, Sitzungsdaten sowie im Mitgliederbereich gespeicherte
                Mitgliedsdaten verarbeitet werden. Passwörter werden nicht im
                Klartext gespeichert, sondern verschlüsselt abgelegt.
              </p>

              <p className="mt-3">
                Für den Betrieb der Website kann Vercel als Hosting-Dienstleister
                eingesetzt werden. Für die Datenbank kann Neon PostgreSQL verwendet
                werden. Für den E-Mail-Versand kann das vereinseigene Postfach
                info@foerderverein-kita-am-biz.de eingesetzt werden.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                7. Wie lange speichern wir Ihre Daten?
              </h2>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Mitgliedsdaten werden für die Dauer der Mitgliedschaft
                  gespeichert und danach nur soweit erforderlich weiter
                  aufbewahrt.
                </li>
                <li>
                  Buchhaltungsunterlagen werden entsprechend gesetzlicher
                  Aufbewahrungspflichten, zum Beispiel bis zu 10 Jahre,
                  gespeichert.
                </li>
                <li>
                  Fotoaufnahmen werden gespeichert, bis der Zweck entfällt oder
                  eine Einwilligung widerrufen wird.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                8. Ihre Rechte
              </h2>

              <ul className="list-disc space-y-2 pl-6">
                <li>Auskunft nach Art. 15 DSGVO</li>
                <li>Berichtigung nach Art. 16 DSGVO</li>
                <li>Löschung und Einschränkung nach Art. 17 und 18 DSGVO</li>
                <li>Datenübertragbarkeit nach Art. 20 DSGVO</li>
                <li>Widerspruch nach Art. 21 DSGVO</li>
                <li>Widerruf einer Einwilligung nach Art. 7 Abs. 3 DSGVO</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                9. Beschwerderecht bei einer Aufsichtsbehörde
              </h2>

              <p>
                Der Landesbeauftragte für den Datenschutz und die
                Informationsfreiheit Rheinland-Pfalz
                <br />
                Postfach 30 40, 55020 Mainz
                <br />
                Besucheradresse: Hintere Bleiche 34, 55116 Mainz
                <br />
                Telefon: 06131 8920-0
                <br />
                E-Mail: poststelle@datenschutz.rlp.de
                <br />
                Webseite: www.datenschutz.rlp.de
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                10. Pflicht zur Bereitstellung von Daten
              </h2>

              <p>
                Bestimmte Angaben sind für die Mitgliedschaft erforderlich. Die
                Einwilligung in Fotoaufnahmen ist freiwillig.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-[#3f6f55]">
                11. Aktualisierung dieser Hinweise
              </h2>

              <p>
                Wir passen diese Datenschutzhinweise an, wenn sich Verfahren
                oder die Rechtslage ändern.
              </p>
            </section>

            <p className="pt-4 text-sm text-[#666]">Stand: 19.02.2026</p>
          </div>
        </div>
      </div>
    </main>
  );
}