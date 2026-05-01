import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UdhariClub — Settle trips without the awkward bhai-paise-bhej",
  description:
    "Track group trip expenses, split fairly, and settle on WhatsApp. Made for Indian friend groups. No login, no nonsense.",
  applicationName: "UdhariClub",
  openGraph: {
    title: "UdhariClub",
    description:
      "Settle trip expenses without the awkward 'bhai paise bhej' conversation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B0F14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
