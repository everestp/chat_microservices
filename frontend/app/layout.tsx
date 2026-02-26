import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Chat App",
  description: "Connec and Chat with Friend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
