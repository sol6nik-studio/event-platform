import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ARENA GRID — киберспортивные турниры',
    template: '%s · ARENA GRID',
  },
  description:
    'Турнирная платформа для игроков и организаторов: команды, регистрация, матчи и сетки в одном месте.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080b12',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark">
      <body>{children}</body>
    </html>
  );
}
