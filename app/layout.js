import { Inter } from "next/font/google";
import "./globals.css";
import "./performance.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { Toaster } from "@/components/ui/sonner";
import PixelBlastBg from "@/components/PixelBlastBg";
import { ClerkTimeoutHandler } from "@/components/clerk-timeout-handler";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "watshibo",
  description: "bankai",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

// Prevent hydration errors globally
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      afterSignOutUrl="/"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://clerk.com" />
        </head>
        <body className={`${inter.className} optimize-text`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkTimeoutHandler />
            <PixelBlastBg />
            <div className="relative z-0">
              <div className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-[6px] shadow-lg border-b border-white/10 contain-paint">
                <Header />
              </div>
              <main className="min-h-screen pt-01">{children}</main>
              <footer className="text-center py-4 text-sm text-muted-foreground relative z-10">
                made with ❤️ by krishna gupta
              </footer>
            </div>
            <Toaster 
              position="top-center"
              expand={true}
              richColors
              closeButton
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}