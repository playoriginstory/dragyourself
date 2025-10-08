// app/layout.tsx
import * as React from 'react';
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Which 90s Supermodel Are You?",
  description: "Upload a photo, answer 4 questions, and get your 90s fashion image. Then make a lipsync video.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
