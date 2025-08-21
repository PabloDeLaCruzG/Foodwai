import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata: Metadata = {
  title: "Foodwai Generator",
  description: "Generador de recetas con inteligencia artificial",
  icons: {
    icon: "/favicon.ico", // Favicon base
    apple: "/apple-icon.png", // Icono para dispositivos Apple
    other: [
      {
        rel: "icon",
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { rel: "mask-icon", url: "/icon0.svg", color: "#ffffff" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head></head>
      <body>{children}</body>
      {/* Social Bar de Adsterra - Carga diferida */}
      <Script
        src="//pl27471490.profitableratecpm.com/80/30/ed/8030ed989b5864652cdfadd3945809ef.js"
        strategy="lazyOnload"
      />
    </html>
  );
}
