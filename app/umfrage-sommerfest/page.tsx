"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Language = "de" | "en" | "tr" | "ar" | "uk";

const headingFont: CSSProperties = {
  fontFamily: "var(--font-baloo)",
};

const translations = {
  de: {
    title: "Deine Meinung ist uns wichtig!",
    subtitle: "Bitte wähle deine Sprache aus.",
    surveyTitle: "Umfrage zum Gesamteindruck",
    changeLanguage: "Sprache ändern",
    name: "Name (optional)",
    rating: "Wie war dein Gesamteindruck?",
    answerOne: "Was hat dir besonders gut gefallen?",
    answerTwo:
      "Was können wir in Zukunft ändern, damit dein Gesamteindruck sich verbessert?",
    submit: "Bewertung absenden",
    required: "Bitte fülle alle Pflichtfelder aus.",
    requiredHint: "Die mit * markierten Felder sind Pflichtfelder.",
    thanksTitle: "Vielen Dank!",
    thanksText: "Vielen Dank für deine Teilnahme an der Umfrage.",
    memberQuestion: "Bist du schon Mitglied im Förderverein?",
    yesMember: "Ja, ich bin bereits Mitglied",
    noMember: "Nein",
    benefitsTitle: "Mitglied werden und die Kita unterstützen",
    benefitsText:
      "Als Mitglied im Förderverein hilfst du dabei, besondere Projekte, Ausflüge, Materialien und Aktionen für die Kinder möglich zu machen.",
    benefitOne: "Unterstützung besonderer Kita-Projekte",
    benefitTwo: "Finanzierung von Ausflügen und Aktionen",
    benefitThree: "Mehr Möglichkeiten für die Kinder",
    benefitFour: "Jahresbeitrag bereits ab 24 €",
    becomeMember: "Ja, ich möchte Mitglied werden",
    close: "Nein, danke",
  },
  en: {
    title: "Your opinion matters to us!",
    subtitle: "Please choose your language.",
    surveyTitle: "Survey about your overall impression",
    changeLanguage: "Change language",
    name: "Name (optional)",
    rating: "What was your overall impression?",
    answerOne: "What did you particularly like?",
    answerTwo:
      "What can we change in the future to improve your overall impression?",
    submit: "Submit review",
    required: "Please fill in all required fields.",
    requiredHint: "Fields marked with * are required.",
    thanksTitle: "Thank you!",
    thanksText: "Thank you for taking part in the survey.",
    memberQuestion: "Are you already a member of the support association?",
    yesMember: "Yes, I am already a member",
    noMember: "No",
    benefitsTitle: "Become a member and support the daycare",
    benefitsText:
      "As a member, you help make special projects, trips, materials and activities possible for the children.",
    benefitOne: "Support special daycare projects",
    benefitTwo: "Help finance trips and activities",
    benefitThree: "Create more opportunities for the children",
    benefitFour: "Annual fee from only €24",
    becomeMember: "Yes, I want to become a member",
    close: "No, thank you",
  },
  tr: {
    title: "Görüşünüz bizim için önemli!",
    subtitle: "Lütfen dilinizi seçin.",
    surveyTitle: "Genel izlenim anketi",
    changeLanguage: "Dili değiştir",
    name: "İsim (isteğe bağlı)",
    rating: "Genel izleniminiz nasıldı?",
    answerOne: "Özellikle neyi beğendiniz?",
    answerTwo:
      "Genel izleniminizin iyileşmesi için gelecekte neyi değiştirebiliriz?",
    submit: "Değerlendirmeyi gönder",
    required: "Lütfen tüm zorunlu alanları doldurun.",
    requiredHint: "* ile işaretli alanların doldurulması zorunludur.",
    thanksTitle: "Teşekkür ederiz!",
    thanksText: "Ankete katıldığınız için teşekkür ederiz.",
    memberQuestion: "Destek derneğine zaten üye misiniz?",
    yesMember: "Evet, zaten üyeyim",
    noMember: "Hayır",
    benefitsTitle: "Üye olun ve çocuk yuvasını destekleyin",
    benefitsText:
      "Üye olarak çocuklar için özel projelerin, gezilerin, materyallerin ve etkinliklerin gerçekleşmesine yardımcı olursunuz.",
    benefitOne: "Özel kreş projelerini destekleyin",
    benefitTwo: "Gezileri ve etkinlikleri finanse etmeye yardımcı olun",
    benefitThree: "Çocuklar için daha fazla imkan sağlayın",
    benefitFour: "Yıllık aidat sadece 24 €'dan başlar",
    becomeMember: "Evet, üye olmak istiyorum",
    close: "Hayır, teşekkürler",
  },
  ar: {
    title: "رأيكم مهم لنا!",
    subtitle: "يرجى اختيار اللغة.",
    surveyTitle: "استبيان الانطباع العام",
    changeLanguage: "تغيير اللغة",
    name: "الاسم (اختياري)",
    rating: "كيف كان انطباعكم العام؟",
    answerOne: "ما الذي أعجبكم بشكل خاص؟",
    answerTwo: "ما الذي يمكننا تغييره في المستقبل لتحسين انطباعكم العام؟",
    submit: "إرسال التقييم",
    required: "يرجى ملء جميع الحقول المطلوبة.",
    requiredHint: "الحقول المميزة بعلامة * مطلوبة.",
    thanksTitle: "شكراً جزيلاً!",
    thanksText: "شكراً لمشاركتكم في الاستبيان.",
    memberQuestion: "هل أنتم بالفعل أعضاء في جمعية الدعم؟",
    yesMember: "نعم، أنا عضو بالفعل",
    noMember: "لا",
    benefitsTitle: "انضموا وادعموا الروضة",
    benefitsText:
      "من خلال العضوية تساعدون في تنفيذ مشاريع ورحلات ومواد وأنشطة خاصة للأطفال.",
    benefitOne: "دعم مشاريع خاصة للروضة",
    benefitTwo: "المساعدة في تمويل الرحلات والأنشطة",
    benefitThree: "توفير فرص أكثر للأطفال",
    benefitFour: "الاشتراك السنوي يبدأ من 24 يورو",
    becomeMember: "نعم، أريد أن أصبح عضواً",
    close: "لا، شكراً",
  },
  uk: {
    title: "Ваша думка важлива для нас!",
    subtitle: "Будь ласка, оберіть мову.",
    surveyTitle: "Опитування про загальне враження",
    changeLanguage: "Змінити мову",
    name: "Ім’я (необов’язково)",
    rating: "Яким було ваше загальне враження?",
    answerOne: "Що вам особливо сподобалося?",
    answerTwo:
      "Що ми можемо змінити в майбутньому, щоб покращити ваше загальне враження?",
    submit: "Надіслати оцінку",
    required: "Будь ласка, заповніть усі обов’язкові поля.",
    requiredHint: "Поля, позначені *, є обов’язковими.",
    thanksTitle: "Дякуємо!",
    thanksText: "Дякуємо за участь в опитуванні.",
    memberQuestion: "Ви вже є членом Förderverein?",
    yesMember: "Так, я вже член",
    noMember: "Ні",
    benefitsTitle: "Станьте членом і підтримайте дитячий садок",
    benefitsText:
      "Як член об’єднання ви допомагаєте реалізовувати особливі проєкти, екскурсії, матеріали та заходи для дітей.",
    benefitOne: "Підтримка особливих проєктів дитсадка",
    benefitTwo: "Фінансування екскурсій та заходів",
    benefitThree: "Більше можливостей для дітей",
    benefitFour: "Річний внесок від 24 €",
    becomeMember: "Так, я хочу стати членом",
    close: "Ні, дякую",
  },
};

const languages: {
  key: Language;
  label: string;
  flag: string;
  hint: string;
}[] = [
  { key: "de", label: "Deutsch", flag: "🇩🇪", hint: "Sprache auswählen" },
  { key: "en", label: "English", flag: "🇬🇧", hint: "Select language" },
  { key: "tr", label: "Türkçe", flag: "🇹🇷", hint: "Dil seç" },
  { key: "ar", label: "العربية", flag: "🇸🇦", hint: "اختيار اللغة" },
  { key: "uk", label: "Українська", flag: "🇺🇦", hint: "Оберіть мову" },
];

export default function UmfragePage() {
  const router = useRouter();

  const [language, setLanguage] = useState<Language | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [answerOne, setAnswerOne] = useState("");
  const [answerTwo, setAnswerTwo] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const [showBenefitsPopup, setShowBenefitsPopup] = useState(false);

  const t = language ? translations[language] : translations.de;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!language || rating === 0 || !answerOne.trim() || !answerTwo.trim()) {
      setError(t.required);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/umfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          name,
          rating: Number(rating),
          answerOne: answerOne.trim(),
          answerTwo: answerTwo.trim(),
        }),
      });

      const data = await res.json();

      setIsSubmitting(false);

      if (!res.ok) {
        console.error("Fehler beim Absenden der Umfrage:", data);
        setError(data.error || "Die Bewertung konnte nicht gespeichert werden.");
        return;
      }

      setShowThanksPopup(true);
    } catch (error) {
      console.error("Fehler beim Absenden der Umfrage:", error);
      setIsSubmitting(false);
      setError("Die Bewertung konnte nicht gespeichert werden.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-12 text-[#2f2f2f]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1
            style={headingFont}
            className="mb-6 text-5xl font-bold text-[#3f6f5a]"
          >
            {t.title}
          </h1>

          <p className="max-w-3xl text-xl leading-8 text-[#3f3f3f]">
            {t.subtitle}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-12">
          {!language && (
            <section>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {languages.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLanguage(item.key)}
                    className="group flex items-center gap-5 rounded-3xl border border-[#dacbbb] bg-[#fffdf9] p-5 text-left text-lg transition hover:-translate-y-1 hover:border-[#3f6f5a] hover:bg-[#f8f5ee] hover:shadow-md"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f5ee] text-4xl transition group-hover:scale-105">
                      {item.flag}
                    </span>

                    <span>
                      <span
                        style={headingFont}
                        className="block text-xl font-bold text-[#3f6f5a]"
                      >
                        {item.label}
                      </span>

                      <span className="mt-1 block text-sm text-[#6f6a61]">
                        {item.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {language && (
            <section>
              <button
                type="button"
                onClick={() => setLanguage(null)}
                className="mb-8 inline-flex items-center rounded-full border border-[#dacbbb] px-4 py-2 text-sm font-medium text-[#3f6f5a] transition hover:bg-[#f8f5ee]"
              >
                ← {t.changeLanguage}
              </button>

              <div className="mb-9 rounded-[1.5rem] bg-[#f8f5ee] px-6 py-6">
                <h2
                  style={headingFont}
                  className="text-3xl font-bold text-[#3f6f5a]"
                >
                  {t.surveyTitle}
                </h2>

                <p className="mt-2 text-sm text-[#666]">{t.requiredHint}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="mb-2 block text-base font-semibold text-[#333]">
                    {t.name}
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-[#dacbbb] bg-[#fffdf9] px-5 py-4 text-base outline-none transition focus:border-[#3f6f5a] focus:bg-white focus:ring-4 focus:ring-[#3f6f5a]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-[#333]">
                    {t.rating} <span className="text-red-600">*</span>
                  </label>

                  <div className="rounded-2xl border border-[#dacbbb] bg-[#fffdf9] px-3 py-4 sm:px-5">
                    <div className="flex flex-nowrap items-center justify-between gap-1 sm:justify-start sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-4xl leading-none transition hover:scale-110 sm:text-5xl ${
                            star <= rating
                              ? "text-yellow-500"
                              : "text-[#d8d0c4]"
                          }`}
                          aria-label={`${star} Sterne`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-[#333]">
                    {t.answerOne} <span className="text-red-600">*</span>
                  </label>

                  <textarea
                    value={answerOne}
                    onChange={(e) => setAnswerOne(e.target.value)}
                    rows={4}
                    required
                    className="w-full rounded-2xl border border-[#dacbbb] bg-[#fffdf9] px-5 py-4 text-base outline-none transition focus:border-[#3f6f5a] focus:bg-white focus:ring-4 focus:ring-[#3f6f5a]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-base font-semibold text-[#333]">
                    {t.answerTwo} <span className="text-red-600">*</span>
                  </label>

                  <textarea
                    value={answerTwo}
                    onChange={(e) => setAnswerTwo(e.target.value)}
                    rows={4}
                    required
                    className="w-full rounded-2xl border border-[#dacbbb] bg-[#fffdf9] px-5 py-4 text-base outline-none transition focus:border-[#3f6f5a] focus:bg-white focus:ring-4 focus:ring-[#3f6f5a]/10"
                  />
                </div>

                {error && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#3f6f5a] px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#345f4d] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "..." : t.submit}
                </button>
              </form>
            </section>
          )}
        </div>
      </div>

      {showThanksPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8f5ee] text-3xl">
              💛
            </div>

            <h2
              style={headingFont}
              className="mb-3 text-3xl font-bold text-[#3f6f5a]"
            >
              {t.thanksTitle}
            </h2>

            <p className="mb-4 leading-7 text-[#555]">{t.thanksText}</p>

            <p className="mb-6 font-semibold text-[#333]">
              {t.memberQuestion}
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full bg-[#3f6f5a] px-5 py-3 font-bold text-white transition hover:bg-[#345f4d]"
              >
                {t.yesMember}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowThanksPopup(false);
                  setShowBenefitsPopup(true);
                }}
                className="rounded-full border border-[#3f6f5a] px-5 py-3 font-bold text-[#3f6f5a] transition hover:bg-[#f8f5ee]"
              >
                {t.noMember}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBenefitsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8f5ee] text-3xl">
              🌱
            </div>

            <h2
              style={headingFont}
              className="mb-3 text-3xl font-bold text-[#3f6f5a]"
            >
              {t.benefitsTitle}
            </h2>

            <p className="mb-6 leading-7 text-[#555]">{t.benefitsText}</p>

            <ul className="mb-6 space-y-3 text-sm text-[#4f4a43]">
              <li className="rounded-2xl bg-[#f8f5ee] px-4 py-3">
                ✓ {t.benefitOne}
              </li>
              <li className="rounded-2xl bg-[#f8f5ee] px-4 py-3">
                ✓ {t.benefitTwo}
              </li>
              <li className="rounded-2xl bg-[#f8f5ee] px-4 py-3">
                ✓ {t.benefitThree}
              </li>
              <li className="rounded-2xl bg-[#f8f5ee] px-4 py-3">
                ✓ {t.benefitFour}
              </li>
            </ul>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.push("#beitritt")}
                className="rounded-full bg-[#3f6f5a] px-5 py-3 font-bold text-white transition hover:bg-[#345f4d]"
              >
                {t.becomeMember}
              </button>

              <button
                type="button"
                onClick={() => setShowBenefitsPopup(false)}
                className="rounded-full border border-[#3f6f5a] px-5 py-3 font-bold text-[#3f6f5a] transition hover:bg-[#f8f5ee]"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}