"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && (pathname === "/sign-in" || pathname === "/sign-up")) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex cursor-pointer items-center gap-3">
            <Image
              src="/Images/Logo/logo_light.svg"
              alt="NoteGraph AI"
              width={160}
              height={40}
              className="h-18 w-auto dark:hidden"
              priority
            />
            <Image
              src="/Images/Logo/logo_dark.svg"
              alt="NoteGraph AI"
              width={160}
              height={40}
              className="hidden h-18 w-auto dark:block"
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 justify-center md:flex">
          <div className="flex items-center gap-2">
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
          </div>
        </nav>

        {/* Right Section */}
        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />

          {!isLoaded ? null : isSignedIn ? (
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                className="font-medium"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <UserButton/>
            </div>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="font-medium">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open Menu" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/Images/Logo/logo_light.svg"
                      alt="NoteGraph AI"
                      width={150}
                      height={36}
                      className="h-8 w-auto dark:hidden"
                      style={{ width: "auto", height: "auto" }}
                    />
                    <Image
                      src="/Images/Logo/logo_dark.svg"
                      alt="NoteGraph AI"
                      width={150}
                      height={36}
                      className="hidden h-8 w-auto dark:block"
                      style={{ width: "auto", height: "auto" }}
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
                  {!isLoaded ? null : isSignedIn ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => router.push("/dashboard")}
                      >
                        Dashboard
                      </Button>

                      <div className="flex justify-center pt-2">
                        <UserButton />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/sign-in" className="w-full">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>

                      <Link href="/sign-up" className="w-full">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}