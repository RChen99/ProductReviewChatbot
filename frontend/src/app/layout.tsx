// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { PageBanner } from '../components/PageBanner';
import { Footer } from '../components/Footer';
import { ChatbotStandalone } from '../../../chatbot/chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const ProductContext = createContext<{
  currentProduct: any;
  setCurrentProduct: (product: any) => void;
}>({
  currentProduct: null,
  setCurrentProduct: () => {}
});

export const useProductContext = () => useContext(ProductContext);

const CartContext = createContext<{
  cartCount: number;
  addToCart: () => void;
}>({
  cartCount: 0,
  addToCart: () => {}
});

export const useCartContext = () => useContext(CartContext);

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isProductPage = location.pathname === '/product';
  const isSearchPage = location.pathname === '/search';
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    if (!isProductPage) {
      setCurrentProduct(null);
    }
  }, [isProductPage]);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const handleProductSearch = (productName: string) => {
    navigate(`/product?q=${encodeURIComponent(productName)}`);
  };

  return (
    <ProductContext.Provider value={{ currentProduct, setCurrentProduct }}>
      <CartContext.Provider value={{ cartCount, addToCart }}>
        <div className={`min-h-screen ${isProductPage || isSearchPage ? 'bg-white' : 'bg-[#eaeded]'}`}>
          <Header />
        
        {!isProductPage && !isSearchPage && <PageBanner />}

        <main className={`max-w-[1500px] mx-auto ${isProductPage ? 'px-0 py-0 bg-white' : 'px-4 py-6'}`}>
          {children}
        </main>

        <Footer />

        <ChatbotStandalone 
          currentProduct={currentProduct} 
          onSearchProduct={handleProductSearch}
        />
        </div>
      </CartContext.Provider>
    </ProductContext.Provider>
  );
}

