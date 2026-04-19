import { Geist_Mono, Outfit } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion"

export const metadata = {
  title: "Zagroda.io",
  description: "Modern farm management",
}

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, outfit.variable, "font-sans")}
    >
      <body className="font-sans">
        <AuthProvider>
          <ThemeProvider>
            <AnimatePresence mode="wait" initial={false}>
              {children}
            </AnimatePresence>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
