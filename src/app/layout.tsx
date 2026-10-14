import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { SimulateJourneyModal } from "@/components/journey/SimulateJourneyModal";

export const metadata: Metadata = {
  title: "Sahaj Seva Portal | सहज सेवा पोर्टल — Ghaziabad",
  description:
    "Ek baar mein kaam, bar bar ka chakkar khatam. Official Citizen & Officer Portal for Ghaziabad District Administration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-sevaBg text-navy-900 antialiased">
        <AppProviders>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <SimulateJourneyModal />
        </AppProviders>
      </body>
    </html>
  );
}
