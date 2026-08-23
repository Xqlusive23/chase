import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { BrandProvider } from "./components/BrandProvider";
import { StoreProvider } from "./components/StoreProvider";
import "./globals.css";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Online banking",
  description: "Personal banking with accounts, payments, and activity in one place.",
  applicationName: "Online banking",
  themeColor: "#0b1f3a",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/api/brand-icon?kind=logo", type: "image/png" }],
    apple: "/api/brand-icon?kind=logo",
  },
  appleWebApp: {
    capable: true,
    title: "Online banking",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} font-[family-name:var(--font-sans)] antialiased`} suppressHydrationWarning>
        <StoreProvider>
          <BrandProvider>{children}</BrandProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
