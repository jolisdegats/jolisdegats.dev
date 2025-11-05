import { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://jolisdegats.dev'),
  title: "Jolisdegats - Fullstack web dev Javascript",
  description: "Ideas, Code and Coffee",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: "Jolisdegats - Fullstack web dev Javascript",
    description: "Ideas, Code and Coffee",
    siteName: "Jolisdegats - Fullstack web dev Javascript",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Jolis Degats Preview",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jolisdegats - Fullstack web dev Javascript",
    description: "Ideas, Code and Coffee",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${playfair.className} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
        {/* Critical CSS - inline to avoid render blocking */}
        <style>{`
          :root {
            --foreground-rgb: 224, 224, 224;
            --background-start-rgb: 40, 44, 52;
            --background-end-rgb: 40, 44, 52;
            --title-color: #4a90e2;
            --link-color: #a3c4ff;
            --link-hover-color: #61dafb;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          body {
            color: rgb(var(--foreground-rgb));
            background: linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb))) rgb(var(--background-start-rgb));
            font-family: 'Roboto', sans-serif;
            overscroll-behavior: none;
            -webkit-overflow-scrolling: touch;
          }
          main {
            width: 100%;
            height: 100%;
            position: relative;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        `}</style>
      </head>
      <body>
        <AppProvider>
          <main className="w-svw h-svh">
            {children}
            <div id="portal-root" />
            <div className='z-[-50] absolute top-0 left-0 w-svw h-svh bg-bg-dark'>
            </div>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}