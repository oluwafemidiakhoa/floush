import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://floushlogistics.com"),
  title: "Floush Logistics | Delivering Excellence. Driving Trust.",
  description:
    "Floush Logistics provides reliable, technology-enabled freight transportation across America.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Floush Logistics | Delivering Excellence. Driving Trust.",
    description:
      "Reliable, technology-enabled freight transportation across America.",
    url: "https://floushlogistics.com",
    siteName: "Floush Logistics",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
