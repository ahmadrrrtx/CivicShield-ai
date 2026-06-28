import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://civicshield.ai'),
  title: {
    default: 'CivicShield AI',
    template: '%s · CivicShield AI'
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  icons: {
    icon: [{ url: '/icons/app-icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icons/app-icon.svg'],
    apple: ['/icons/app-icon.svg']
  },
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
