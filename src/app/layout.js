

import SessionWrapper from "@/components/sessionProvider";

import "./globals.css";
export const metadata = {
  title: "Next Auth App", // <-- This changes the Chrome tab text
  description: "Authentication app with Next.js",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <SessionWrapper>
      
        <body>{children}</body>
      
    </SessionWrapper>
    </html>
  );
}
