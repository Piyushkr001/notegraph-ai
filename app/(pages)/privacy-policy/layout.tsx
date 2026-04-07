import React from "react";

export const metadata = {
  title: "Privacy Policy - Notegraph AI",
  description: "Privacy Policy - Notegraph AI",
};

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="privacy-layout">
      {children}
    </div>
  );
}
