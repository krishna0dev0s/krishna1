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
import { MotionConfig } from "framer-motion";
import { PwaRegister } from "@/components/pwa-register";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "watshibo",
  description: "bankai",
  manifest: "/manifest.webmanifest",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

// Prevent hydration errors globally
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  const defaultSpring = {
    type: 'spring',
    stiffness: 220,
    damping: 26,
    mass: 0.9,
  };

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
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/image.png" />
          <meta name="theme-color" content="#0f172a" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        </head>
        <body className={`${inter.className} optimize-text`}>
          <MotionConfig transition={defaultSpring} reducedMotion="user">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ClerkTimeoutHandler />
              <PwaRegister />
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
          </MotionConfig>
        </body>
      </html>
    </ClerkProvider>
  );
}