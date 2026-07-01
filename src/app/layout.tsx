import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J. | Junaid Jamshed - Premium Fashion Store",
  description: "Premium fashion for the modern individual. Shop women's, men's, and teens' clothing, fragrances, and accessories.",
  icons: {
    icon: "/assets/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
