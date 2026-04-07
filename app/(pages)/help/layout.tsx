import React from "react";

export const metadata = {
  title: "Help - Notegraph AI",
  description: "Help - Notegraph AI",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="help-layout">
      {children}
    </div>
  );
}
