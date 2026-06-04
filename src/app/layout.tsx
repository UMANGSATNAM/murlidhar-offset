import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Murlidhar Offset — Where Every Print Tells a Story",
  description:
    "Murlidhar Offset — Gujarat's trusted printing press. From business cards to wedding invitations, we bring your vision to life with premium quality printing. Visiting Cards, Wedding Cards, Brochures, Flyers, Stickers, Flex Banners, and more.",
  keywords: [
    "Murlidhar Offset",
    "printing press",
    "Gujarat printing",
    "business cards",
    "wedding cards",
    "brochure printing",
    "flyer printing",
    "sticker printing",
    "flex banner",
    "offset printing",
    "bulk printing",
    "custom printing",
  ],
  authors: [{ name: "Murlidhar Offset" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Murlidhar Offset — Where Every Print Tells a Story",
    description:
      "Gujarat's trusted printing press. Premium quality printing for business cards, wedding cards, brochures, and more.",
    siteName: "Murlidhar Offset",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Murlidhar Offset — Where Every Print Tells a Story",
    description:
      "Gujarat's trusted printing press. Premium quality printing for all your needs.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
