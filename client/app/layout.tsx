import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestura - Sign Language Social Platform",
  description: "Connect, learn, and share through sign language. Gestura is a social platform that makes communication accessible for everyone.",
  keywords: ["sign language", "accessibility", "social media", "communication", "gesture recognition"],
  authors: [{ name: "Gestura Team" }],
  creator: "Gestura",
  publisher: "Gestura",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gestura.app"),
  openGraph: {
    title: "Gestura - Sign Language Social Platform",
    description: "Connect, learn, and share through sign language. Gestura is a social platform that makes communication accessible for everyone.",
    url: "https://gestura.app",
    siteName: "Gestura",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gestura - Sign Language Social Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestura - Sign Language Social Platform",
    description: "Connect, learn, and share through sign language. Gestura is a social platform that makes communication accessible for everyone.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}




