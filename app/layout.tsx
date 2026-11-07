import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";


export const metadata: Metadata = {
  title: "T&B Global Logística Internacional",
  description:
    "Carga consolidada desde China y Brasil, FCL, LCL y courier aéreo. Puerta a puerta en toda Argentina.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1 pt-20">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}