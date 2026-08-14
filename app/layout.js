import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import AppShell from "@/components/AppShell";
import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";

const inter = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Foodi — Discover Delicious Recipes",
  description:
    "Explore a variety of recipes crafted with love and flavor. From quick bites to gourmet meals, bring your cooking journey to life.",
  icons: {
    icon: [
      {
        url: "/favIcon.webp",
        type: "image/webp",
        sizes: "128x128",
      },
      {
        url: "/favIcon.webp",
        type: "image/webp",
        sizes: "152x152",
      },
      {
        url: "/favIcon.webp",
        type: "image/webp",
        sizes: "180x180",
      },
      {
        url: "/favIcon.webp",
        type: "image/webp",
        sizes: "512x512",
      },
    ],
    shortcut: "/favIcon.webp",
    apple: "/favIcon.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-[#faf7f2] text-[#171717]" suppressHydrationWarning>
        <ThemeInitializer />
        <AppShell className="bg-gradient-to-r from-[#F9DEC1] via-[#F6EFE8] to-[#F7F3EE]">{children}</AppShell>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
