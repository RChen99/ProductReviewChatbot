// @ts-nocheck
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { Footer } from '../components/Footer';
import { ChatbotStandalone } from '../../../chatbot/chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isProductPage = location.pathname === '/product';

  return (
    <div className={`min-h-screen ${isProductPage ? 'bg-white' : 'bg-[#eaeded]'}`}>
      <Header />
      
      {!isProductPage && <HeroBanner />}

      <main className={`max-w-[1500px] mx-auto ${isProductPage ? 'px-0 py-0 bg-white' : 'px-4 py-6'}`}>
        {children}
      </main>

      <Footer />

      <ChatbotStandalone />
    </div>
  );
}

