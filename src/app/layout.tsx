import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
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
          <main className="ml-64 min-h-screen">
            {children}
          </main>
        </SettingsProvider>
      </body>
    </html>
  );
}
