import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SettingsProvider } from "@/lib/settings-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImmoAnalyse – KI-gestützte Immobilien Investment Plattform",
  description: "Professionelle SaaS-Plattform für Immobilieninvestoren.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-950 text-gray-100">
        <SettingsProvider>
          <Sidebar />
          <MobileNav />
          <main className="md:ml-56 min-h-screen pb-16 md:pb-0">
            {children}
          </main>
        </SettingsProvider>
      </body>
    </html>
  );
}
