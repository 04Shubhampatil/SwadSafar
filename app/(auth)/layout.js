import { Plus_Jakarta_Sans } from "next/font/google";
import "./auth.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export default function AuthLayout({ children }) {
  return (
    <div
      className={`${plusJakarta.variable} [font-family:var(--font-plus-jakarta)]`}
    >
      {children}
    </div>
  );
}
