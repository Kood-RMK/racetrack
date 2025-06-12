import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairoFont = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
})


export const metadata: Metadata = {
  title: "Racetrack Control",
  description: "Racetrack Control Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cairoFont.variable} h-full w-full`}>
        <body>
          {children}
        </body>
    </html>
  );
}
