import React from "react";

export const metadata = {
  title: "About - Notegraph AI",
  description: "About - Notegraph AI",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="about-layout">
      {children}
    </div>
  );
}
