import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatWidget from '../components/chat/ChatWidget';

export const metadata: Metadata = {
  title: 'GuardianRS | Premium OSRS Boosting & Powerleveling Marketplace',
  description: 'Elevate your Old School RuneScape adventure with GuardianRS. 100% manual, hand-done skill leveling, quest helper, minigame calculator, and bossing services with VPN matching protection.',
  keywords: 'OSRS boosting, runescape leveling, fire cape, infernal cape, osrs skills, combat achievements, guardianrs, runescape calculator',
  openGraph: {
    title: 'GuardianRS | Premium OSRS Boosting Services',
    description: 'Elevate your Old School RuneScape adventure with GuardianRS. Hand-done, safe, and secure.',
    url: 'https://guardianrs.com',
    siteName: 'GuardianRS',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-[#0a0a1a] text-white">
        <div className="mesh-bg" />
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
