import React from "react";

export const metadata = {
  title: "Terms of Service - Notegraph AI",
  description: "Terms of Service - Notegraph AI",
};

export default function TermsOfServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="terms-layout">
      {children}
    </div>
  );
}
