import React from "react";

export const metadata = {
  title: "Contact - Notegraph AI",
  description: "Contact - Notegraph AI",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="contact-layout">
      {children}
    </div>
  );
}
