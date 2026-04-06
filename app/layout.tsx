import type { Metadata } from "next";
import { Exo, Geist, Geist_Mono, Saira_Stencil_One } from "next/font/google";
import "./globals.css";
import Navbar from "./_shared/Navbar";
import Footer from "./_shared/Footer";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "react-hot-toast";

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
      lang="en" suppressHydrationWarning
      className={`${exo.className} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>
              <Navbar />
              {children}
              <Footer />
              <Toaster  position="bottom-right" />
            </Provider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
