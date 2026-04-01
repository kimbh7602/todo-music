import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
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
  title: "Todo Music",
  description: "Play your tasks like music",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Todo Music",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#d4a0b0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        {/* SVG filter for liquid glass refraction */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <defs>
            <filter id="liquid-glass-filter">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015"
                numOctaves="3"
                seed="2"
                result="turb"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turb"
                scale="6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <ServiceWorkerRegistrar />
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
