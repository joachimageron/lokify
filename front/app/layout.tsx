import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/providers/Providers";

export const metadata: Metadata = {
  title: "Lokify",
  description: "Lokify is the best loker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
