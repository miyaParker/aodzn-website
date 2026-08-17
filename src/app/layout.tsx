import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const mangoGrotesque = localFont({
  src: '../fonts/MangoGrotesque/Mango Grotesque-VF.ttf',
  weight: '100 900',
  style: 'normal',
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AODZN — Abdulazees Olayinka | Senior Creative Product Designer',
  description:
    'Award-worthy cinematic portfolio with GSAP animations, Lenis smooth scrolling, and interactive digital product experiences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${plusJakartaSans.variable} ${syne.variable} ${mangoGrotesque.variable}`}
    >
      <body className="text-[#111111] antialiased selection:bg-black selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
