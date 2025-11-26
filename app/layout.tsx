// app/layout.tsx
import * as React from 'react';
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Back to the 90s",
  description: "90s fashion generator and pop quiz.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
