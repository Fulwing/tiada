import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from '../components/Header';
import '../styles/globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tiada",
  description: "Ultimate AI-Powered Usability Testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} >
        <Header/>
        {children}
      </body>
    </html>
  );
}
