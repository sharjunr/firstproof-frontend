import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "FirstProof · Prove Your Potential. Earn Your Opportunity.",
  description:
    "Discover employer challenges, demonstrate your abilities, and follow your next opportunity. A clearly labeled UNHACK 2026 interactive demo.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
