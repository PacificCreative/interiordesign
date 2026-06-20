import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Spatial',
    default: 'Spatial — Business OS for Interior Designers',
  },
  description:
    'All-in-one business operating system for interior designers — project management, style assessment, product sourcing, mood boards, and client portal.',
  keywords: [
    'interior design',
    'project management',
    'mood board',
    'design software',
    'interior design app',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#7E5E3A',
          colorBackground: '#FDFBF7',
          colorText: '#2E3035',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'shadow-soft border border-slate-100',
          formButtonPrimary: 'btn-primary',
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
        <body className="min-h-screen bg-cream-50 font-sans text-slate-800 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}