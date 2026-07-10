import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delfzijl RP Webshop',
  description: 'Officiële Delfzijl RP supporter webshop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
