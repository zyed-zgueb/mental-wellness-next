import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { LocaleProvider } from "./LocaleContext";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MindWell - Suivi de santé mentale",
    template: "%s | MindWell",
  },
  description:
    "Votre compagnon pour un bien-être mental épanoui. Suivez votre humeur, définissez des objectifs et améliorez votre santé mentale.",
  keywords: [
    "santé mentale",
    "bien-être",
    "suivi humeur",
    "journal",
    "objectifs",
    "mental health",
    "wellness",
    "mood tracking",
  ],
  authors: [{ name: "MindWell" }],
  creator: "MindWell",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "MindWell",
    title: "MindWell - Suivi de santé mentale",
    description:
      "Votre compagnon pour un bien-être mental épanoui. Suivez votre humeur, définissez des objectifs et améliorez votre santé mentale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindWell - Suivi de santé mentale",
    description:
      "Votre compagnon pour un bien-être mental épanoui.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MindWell",
  description:
    "Votre compagnon pour un bien-être mental épanoui. Suivez votre humeur, définissez des objectifs et améliorez votre santé mentale.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  // Unwrap du paramètre dynamique (Next 16)
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
    console.error('locale not found');
  }

  const messages = await getMessages();
  
  console.warn('Locale', locale)
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider locale={locale}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              >
              <SiteHeader />
              <main id="main-content">{children}</main>
              <SiteFooter />
              <Toaster richColors position="top-right" />
            </ThemeProvider>
          </NextIntlClientProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}