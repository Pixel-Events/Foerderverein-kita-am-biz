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

        </section>
      </div>
    </main>
  );
}