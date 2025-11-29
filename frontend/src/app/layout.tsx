// @ts-nocheck
import React from 'react';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { Footer } from '../components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Header />
      
      <HeroBanner />

      <main className="max-w-[1500px] mx-auto px-4 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}

