import { DM_Mono, DM_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { AlertProvider } from "@/hooks/use-alert"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata = {
  title: "Zagroda.io",
  description: "Modern farm management",
}

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

const dmMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        dmMono.variable,
        dmSans.variable,
        "font-sans"
      )}
    >
      <body className="font-sans">
        <AuthProvider>
          <AlertProvider>
            <ThemeProvider>
              <TooltipProvider>
                <AnimatePresence mode="wait" initial={false}>
                  {children}
                </AnimatePresence>
              </TooltipProvider>
              <Toaster />
            </ThemeProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
