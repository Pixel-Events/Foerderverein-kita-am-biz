import Link from "next/link";

export default function SpendenPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-16 text-[#2f2f2f]">
      <div className="mx-auto max-w-4xl">
        <Link
  href="/"
  className="inline-flex items-center gap-3 rounded-full bg-[#3f6f55] px-6 py-3 font-semibold text-white transition hover:bg-[#335945]"
>
  <span>←</span>
  <span>Zur Startseite</span>
</Link>

        <section className="mt-8 rounded-[36px] bg-white p-8 shadow-xl md:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#8daa91]">
            Förderverein Kita am BiZ
          </p>

          <h1
            style={{ fontFamily: "var(--font-baloo)" }}
            className="mb-6 text-5xl font-bold text-[#3f6f55]"
          >
            Spenden
          </h1>

          <p className="mb-8 text-lg leading-8 text-[#555]">
            Mit deiner Spende unterstützt du Projekte, Anschaffungen und
            besondere Erlebnisse für die Kinder unserer Kita.
          </p>

          <div className="mb-10 rounded-3xl bg-[#eaf2ea] p-6">
            <h2
              style={{ fontFamily: "var(--font-baloo)" }}
              className="mb-4 text-3xl font-bold text-[#3f6f55]"
            >
              Bankverbindung
            </h2>

            <div className="space-y-3 text-[#333]">
              <p>
                <strong>Empfänger:</strong> Förderverein Kita am BiZ e. V.
              </p>
              <p>
                <strong>IBAN:</strong> DE71 5509 1200 0041 0576 02
              </p>
              <p>
                <strong>BIC:</strong> GENODE61AZY
              </p>
              <p>
                <strong>Verwendungszweck:</strong> Spende Förderverein Kita am BiZ
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {["10 €", "25 €", "50 €"].map((amount) => (
              <div
                key={amount}
                className="rounded-3xl border border-[#ece6dc] bg-[#f8f5ee] p-6 text-center"
              >
                <p
                  style={{ fontFamily: "var(--font-baloo)" }}
                  className="text-4xl font-bold text-[#3f6f55]"
                >
                  {amount}
                </p>
                <p className="mt-2 text-sm text-[#666]">
                  hilft direkt bei Projekten für die Kinder
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 rounded-3xl bg-[#fff8df] p-5 text-sm leading-7 text-[#6f5a00]">
            Hinweis: Für Spenden kann auf Wunsch eine Spendenbescheinigung
            ausgestellt werden. Bitte gib dafür deinen Namen und deine Adresse im
            Verwendungszweck oder per E-Mail an.
          </p>
        </section>
      </div>
    </main>
  );
}