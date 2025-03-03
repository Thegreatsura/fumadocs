import './global.css';
import type { Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import { AISearchTrigger } from '@/components/ai';
import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export const metadata = createMetadata({
  title: {
    template: '%s | Fumadocs',
    default: 'Fumadocs',
  },
  description: 'The Next.js framework for building documentation sites',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <Provider>
          {children}
          <AISearchTrigger>
            <MessageCircle className="size-4" />
            Ask AI
          </AISearchTrigger>
        </Provider>
      </Body>
    </html>
  );
}
