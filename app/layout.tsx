import type { Metadata } from "next";
import { Baloo_2, Noto_Sans } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Förderverein Kita am BiZ",
  description: "Förderverein der Kita am BiZ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${baloo.variable} ${noto.variable}`}>
      <body className="font-[var(--font-noto)] antialiased">
        {children}
      </body>
    </html>
  );
}