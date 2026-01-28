// app/layout.tsx
import * as React from "react";
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Back to the 90s",
  description: "90s fashion generator and pop quiz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 min-h-screen flex items-center justify-center">
        {/* iPhone 16 Pro body */}
        <div
          className="
            relative
            w-[393px]
            h-[852px]
            bg-black
            rounded-[44px]
            shadow-2xl
            flex
            items-center
            justify-center
          "
        >
          {/* Screen */}
          <div
            className="
              relative
              w-[375px]
              h-[812px]
              bg-white
              rounded-[36px]
              overflow-hidden
            "
          >
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-[126px] h-[36px] bg-black rounded-full" />
            </div>

            {/* App content */}
            <div className="h-full overflow-y-auto pt-14 text-gray-900">
              {children}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full" />
          </div>
        </div>
      </body>
    </html>
  );
}
