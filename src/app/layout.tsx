import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eu vi",
  icons: {
    icon: "/logomapa.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <div
            className="h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(/bg-img.png)` }}
          >
            <div className="relative h-full sm:min-h-[95vh] w-[420px] bg-[#145CCC] shadow-xl overflow-auto">
              <PageTransition>
                <div className="h-full w-full relative">{children}</div>
              </PageTransition>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
