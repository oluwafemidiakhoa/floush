import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Floush Logistics | Delivering Excellence. Driving Trust.",
  description:
    "Floush Logistics provides reliable, technology-enabled freight transportation across America.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
