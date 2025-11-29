// @ts-nocheck
import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layout';
import { Products } from './content';
import ProductPage from './product/page';
import './globals.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Products />
          </Layout>
        } />
        <Route path="/product" element={
          <Layout>
            <ProductPage />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
