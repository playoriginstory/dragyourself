// app/layout.tsx
import * as React from 'react';
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drag Yourself",
  description: "Transform your photo into a fabulous drag version of you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
