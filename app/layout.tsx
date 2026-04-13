import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Inter } from 'next/font/google'
 
const inter = Inter({
  subsets: ['latin'],
})
 
export const metadata: Metadata = {
  title: "chaos",
  description: "Life tool for chaotic divas",
  icons: {
    icon: {
      url: '/favicon.gif?v=1',
      type: 'image/gif',
    },
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body className="homepage">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Auth0Provider>
            {children}
          </Auth0Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}