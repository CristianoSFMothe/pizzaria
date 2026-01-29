import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Pizzaria Millennium",
    template: "%s | Pizzaria Millennium",
  },
  description:
    "Painel administrativo da Pizzaria Millennium para gestão de pedidos, produtos e categorias.",
  applicationName: "Pizzaria Millennium",
  keywords: [
    "pizzaria",
    "restaurante",
    "gestão",
    "pedidos",
    "produtos",
    "categorias",
    "painel administrativo",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Pizzaria Millennium",
    description:
      "Painel administrativo da Pizzaria Millennium para gestão de pedidos, produtos e categorias.",
    type: "website",
    locale: "pt_BR",
    siteName: "Pizzaria Millennium",
  },
  twitter: {
    card: "summary",
    title: "Pizzaria Millennium",
    description:
      "Painel administrativo da Pizzaria Millennium para gestão de pedidos, produtos e categorias.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
