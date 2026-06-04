import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import StructuredData from "@/components/seo/StructuredData";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const siteUrl = "https://murlidharoffset.com";

export const viewport: Viewport = {
  themeColor: "#0D1B3D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Murlidhar Offset - Premium Offset Printing",
    default:
      "Murlidhar Offset - Premium Offset Printing Solutions in Gujarat, India",
  },
  description:
    "Murlidhar Offset is Gujarat's premier offset printing press offering premium business cards, wedding cards, brochures, flyers, stickers, flex banners, letter pads, bill books, and custom printing solutions. Trusted by 10,000+ businesses across India with ISO 9001 certified quality, 24-hour turnaround, and competitive bulk pricing.",
  keywords: [
    "offset printing",
    "business cards printing",
    "wedding cards printing",
    "brochure printing",
    "flyer printing",
    "sticker printing",
    "flex banner printing",
    "letter pad printing",
    "bill book printing",
    "poster printing",
    "packaging printing",
    "custom printing",
    "bulk printing",
    "printing press Gujarat",
    "printing press India",
    "Murlidhar Offset",
    "Rajkot printing",
    "offset printing press",
    "commercial printing",
    "digital printing",
    "lamination services",
    "xerox services",
    "visiting cards",
    "invitation cards",
    "printing services near me",
    "wholesale printing",
    "GST invoicing printing",
  ],
  authors: [{ name: "Murlidhar Offset", url: siteUrl }],
  creator: "Murlidhar Offset",
  publisher: "Murlidhar Offset",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title:
      "Murlidhar Offset - Premium Offset Printing Solutions in Gujarat, India",
    description:
      "Gujarat's premier offset printing press. Premium quality business cards, wedding cards, brochures, flyers, and more. ISO 9001 certified, 24hr turnaround, serving 10,000+ businesses.",
    url: siteUrl,
    siteName: "Murlidhar Offset",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/products/hero-printing-press.png",
        width: 1200,
        height: 630,
        alt: "Murlidhar Offset - Premium Offset Printing Press",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Murlidhar Offset - Premium Offset Printing Solutions in Gujarat, India",
    description:
      "Gujarat's premier offset printing press. Premium quality business cards, wedding cards, brochures, and more. ISO 9001 certified.",
    images: ["/products/hero-printing-press.png"],
    creator: "@murlidharoffset",
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
  category: "printing services",
  classification: "Commercial Printing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <StructuredData />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
