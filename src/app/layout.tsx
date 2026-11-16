import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Operación PAES · Desactiva la Bomba",
  description:
    "Juego de desactivación de bombas con ejercicios tipo PAES de Matemática (M1 y M2). Elige tu módulo, escoge la bomba por eje temático y desactiva los módulos antes de que explote.",
  keywords: [
    "PAES",
    "Matemática",
    "M1",
    "M2",
    "juego educativo",
    "Chile",
    "DEMRE",
    "desactivar bombas",
  ],
  authors: [{ name: "Operación PAES" }],
  openGraph: {
    title: "Operación PAES · Desactiva la Bomba",
    description:
      "Resuelve ejercicios tipo PAES de Matemática (M1/M2) para desactivar bombas por eje temático antes de que el tiempo se agote.",
    siteName: "Operación PAES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
