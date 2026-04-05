import type { Metadata } from "next";
import { Exo, Geist, Geist_Mono, Saira_Stencil_One } from "next/font/google";
import "./globals.css";
import Navbar from "./_shared/Navbar";
import Footer from "./_shared/Footer";

const exo = Exo({
  subsets: ["latin"],
  variable: "--font-exo",
  weight: "400",
});

export const metadata: Metadata = {
  title: "NoteGraph AI",
  description: "AI-powered note-taking and knowledge management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exo.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
