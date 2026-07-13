import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SelectionProvider } from "../src/state/selectionStore";
import { getCatalog } from "../src/data/getCatalog";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bundle Builder | Build your security system",
  description:
    "Configure your own home security bundle — pick cameras, sensors, and a plan, then review your system in real time.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalog = await getCatalog();

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SelectionProvider catalog={catalog}>{children}</SelectionProvider>
      </body>
    </html>
  );
}
