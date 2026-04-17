import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Inter } from 'next/font/google'
 
const inter = Inter({
  subsets: ['latin'],
})
 
export const metadata: Metadata = {
  title: "Ambre Nguyen - Portfolio",
  description: "3d portfolio",
  icons: {
    icon: {
      url: '/favicon.gif',
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
      <body className="homepage h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}