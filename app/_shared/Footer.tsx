"use client"
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const productLinks = [
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About", href: "/about" },
];

const resourceLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: InstagramLogoIcon, color: "#E1306C" },
  { name: "Facebook", href: "https://facebook.com", icon: FacebookLogoIcon, color: "#1877F2" },
  { name: "LinkedIn", href: "https://linkedin.com", icon: LinkedinLogoIcon, color: "#0A66C2" },
  { name: "X", href: "https://x.com", icon: XLogoIcon, color: "#000000" },
];

export default function Footer({ hideOnDashboard = true }: { hideOnDashboard?: boolean } = {}) {
  const pathname = usePathname();
  
  if (hideOnDashboard && pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl supports-backdrop-filter:bg-white/50 dark:supports-backdrop-filter:bg-gray-950/50 relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto flex max-w-6xl flex-col px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand / Intro */}
          <div className="flex max-w-md flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/Images/Logo/logo_light.svg"
                alt="NoteGraph AI"
                width={160}
                height={40}
                className="h-10 w-auto dark:hidden"
              />
              <Image
                src="/Images/Logo/logo_dark.svg"
                alt="NoteGraph AI"
                width={160}
                height={40}
                className="hidden h-10 w-auto dark:block"
              />
            </Link>

            <p className="text-sm leading-6 text-muted-foreground">
              NoteGraph AI transforms unstructured notes into organized,
              searchable knowledge with summaries, topics, tags, and concept
              relationships.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href="/sign-up">
                <Button className="rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all scale-100 hover:scale-105">Get Started</Button>
              </Link>

              <Link href="/features">
                <Button variant="outline" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all scale-100 hover:scale-105 backdrop-blur-sm bg-white/50 dark:bg-transparent">
                  Explore Features
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap lg:gap-16">
            {/* Product */}
            <div className="flex min-w-[140px] flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <div className="flex flex-col gap-2">
                {productLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 inline-block w-max"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="flex min-w-[160px] flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <div className="flex flex-col gap-2">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 inline-block w-max"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact / Social */}
            <div className="flex min-w-[180px] flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">Connect</h3>

              <Link
                href="mailto:hello@notegraph.ai"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 w-max"
              >
                <Mail className="h-4 w-4" />
                hello@notegraph.ai
              </Link>

              <div className="flex items-center gap-2 pt-1">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:-translate-y-1 bg-white/50 dark:bg-transparent"
                        aria-label={item.name}
                      >
                        <Icon className="h-4 w-4" color={item.color} />
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NoteGraph AI. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}