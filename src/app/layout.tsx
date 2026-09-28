import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { agent } from "@/content/agent";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://site-randall-hon.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${agent.name} | ${agent.brokerage}, Houston TX`,
    template: `%s | ${agent.name}`,
  },
  description: `${agent.name} — REALTOR® with ${agent.brokerage}, serving Houston real estate since ${agent.practiceSince}. ${agent.closedTransactions} closed transactions across buying, selling, leasing, and property management.`,
  keywords: [
    "Randall Hon",
    "Houston real estate agent",
    "My City Real Estate",
    "Houston REALTOR",
    "Houston homes for sale",
    "Houston property management",
  ],
  openGraph: {
    title: `${agent.name} | ${agent.brokerage}`,
    description: `Houston real estate since ${agent.practiceSince}. ${agent.closedTransactions} closed transactions.`,
    url: siteUrl,
    siteName: `${agent.name} Real Estate`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${agent.name} | ${agent.brokerage}`,
    description: `Houston real estate since ${agent.practiceSince}.`,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
