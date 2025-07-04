import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import { Toaster } from "ui/sonner";
import { BASE_THEMES } from "lib/const";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { AuthGuard } from "@/components/auth-guard";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sara",
  description:
    "Sara is an AI assistant that uses MCP Tools to answer questions and help you.",
};

const themes = BASE_THEMES.flatMap((t) => [t, `${t}-dark`]);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="default-dark"
          themes={themes}
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <AuthGuard>
              {children}
              <Toaster richColors />
            </AuthGuard>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
