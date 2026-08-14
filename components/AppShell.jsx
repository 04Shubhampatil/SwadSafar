"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const hideFooter = hideNavbar;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
