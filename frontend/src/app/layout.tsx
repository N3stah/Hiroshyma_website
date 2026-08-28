import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const BASE_URL = "https://hiroshyma-oyk.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s -- Hiroshyma.Oyk",
    default: "Hiroshyma.Oyk | Custom Streetwear Nairobi",
  },
  description:
    "Custom streetwear, graphic design, logo design and printing from Nairobi CBD. Built for those who refuse to blend in.",
  openGraph: {
    type: "website",
    siteName: "Hiroshyma.Oyk",
    locale: "en_KE",
    url: BASE_URL,
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Hiroshyma.Oyk -- Custom Streetwear Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col ${fraunces.variable} ${jetbrainsMono.variable}`}
        style={{ backgroundColor: "var(--hiro-bg)", color: "var(--hiro-text)" }}
      >
        <ToastProvider>
          <Header />
          <main className="flex-1 pt-14">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
