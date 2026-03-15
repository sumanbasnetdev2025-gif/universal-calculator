import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/layout/ThemeProvider";
import Navbar from "@/components/ui/layout/navbar";
import Footer from "@/components/ui/layout/footer";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-poppins",
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calcnepal.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)",  color: "#16161f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  "CalcNepal — Smart Calculators for Nepal",
    template: "%s | CalcNepal",
  },
  description:
    "Free online calculators for Nepal — BS/AD date converter, NEA electricity bill, " +
    "EMI, land units (Ropani, Bigha), salary & income tax, fuel cost, BMI and more.",
  keywords: [
    "Nepal calculator", "BS AD date converter", "Nepali date converter",
    "NEA electricity bill calculator", "EMI calculator Nepal",
    "Ropani to sqft", "land unit converter Nepal",
    "Nepal income tax 2081", "salary calculator Nepal",
    "fuel cost calculator Nepal", "BMI calculator",
  ],
  authors:   [{ name: "CalcNepal", url: BASE }],
  creator:   "CalcNepal",
  publisher: "CalcNepal",
  robots:    { index: true, follow: true },
  openGraph: {
    type:     "website",
    locale:   "en_US",
    url:       BASE,
    siteName: "CalcNepal",
    title:    "CalcNepal — Smart Calculators for Nepal",
    description: "BS/AD converter, NEA electricity, EMI, land units, salary & more — free tools for Nepal.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CalcNepal" }],
  },
  twitter: {
    card:    "summary_large_image",
    title:   "CalcNepal — Smart Calculators for Nepal",
    description: "BS/AD, NEA electricity, EMI, land units, salary & more.",
    images:  ["/opengraph-image"],
  },
  manifest: "/manifest.json",
  icons: {
    icon:    [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple:   [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
     <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col gradient-mesh">
            <Navbar />
            <main className="flex-1 pt-14 sm:pt-16">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}