import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GenesysProvider from "./components/providers/GenesysProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genesys Chat Demo",
  description: "Next.js integration for Genesys WebChat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.0.5/css/themes/tooltipster-noir.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.0.5/css/themes/tooltipster-shadow.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.0.5/css/tooltipster.min.css" />
      </head>
      <body className={inter.className}>
        {children}
        <GenesysProvider />
      </body>
    </html>
  );
}