// @ts-nocheck
import React from 'react';
import { createRoot } from "react-dom/client";
import { Layout } from './layout';
import { Products } from './content';
import './globals.css';

function App() {
  return (
    <Layout>
      <Products />
    </Layout>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
