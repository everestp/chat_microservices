import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";



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
        <AppProvider>

        {children}
        <Toaster/>
        </AppProvider>
      </body>
    </html>
  );
}
