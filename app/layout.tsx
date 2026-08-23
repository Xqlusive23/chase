import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { BrandProvider } from "./components/BrandProvider";
import "./globals.css";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Online banking",
  description: "Personal banking with accounts, payments, and activity in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} font-[family-name:var(--font-sans)] antialiased`} suppressHydrationWarning>
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  );
}
