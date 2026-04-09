import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Ethiopic } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-ethiopic',
});

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mizan.vercel.app'),
  title: {
    default: 'Mizan — Ethiopia\'s Financial Intelligence Platform',
    template: '%s | Mizan',
  },
  description: 'Compare 387+ financial products, track spending, grow your Mizan Score, and make smarter money decisions. Built for Ethiopia.',
  keywords: ['Ethiopian finance', 'savings account Ethiopia', 'loan comparison', 'financial literacy', 'Mizan Score', 'Ethiopian banking'],
  authors: [{ name: 'Mizan' }],
  creator: 'Mizan',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mizan.et',
    siteName: 'Mizan',
    title: 'Mizan — Ethiopia\'s Financial Intelligence Platform',
    description: 'Compare 387+ financial products, track spending, grow your Mizan Score.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mizan — Smart Finance for Ethiopia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mizan — Ethiopia\'s Financial Intelligence Platform',
    description: 'Compare 387+ financial products. Track spending. Grow your score.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansEthiopic.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-[#6ED063] selection:text-white" suppressHydrationWarning>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

