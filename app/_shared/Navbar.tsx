"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Images/Logo/logo_light.svg"
              alt="NoteGraph AI"
              width={160}
              height={40}
              className="h-16 w-auto dark:hidden"
              priority
            />
            <Image
              src="/Images/Logo/logo_dark.svg"
              alt="NoteGraph AI"
              width={160}
              height={40}
              className="hidden h-16 w-auto dark:block"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">
              Login
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="font-medium">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/logo_light.svg"
                      alt="NoteGraph AI"
                      width={150}
                      height={36}
                      className="h-8 w-auto dark:hidden"
                    />
                    <Image
                      src="/logo_dark.svg"
                      alt="NoteGraph AI"
                      width={150}
                      height={36}
                      className="hidden h-8 w-auto dark:block"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex h-full flex-col justify-between py-6">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const active = isActiveLink(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 flex flex-col gap-3">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>

                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}