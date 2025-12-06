// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { searchProducts, Product } from '../../services/api';
import './search.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = searchParams.get('q') || '';

  console.log('SearchPage rendered, query:', query, 'loading:', loading, 'products:', products.length);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setError('No search query provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Searching for:', query);
        const results = await searchProducts(query);
        console.log('Search results:', results);
        setProducts(results);
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const getRandomColor = (index: number): 'red' | 'green' => {
    const colors: ('red' | 'green')[] = ['red', 'green'];
    return colors[index % 2];
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product?product_id=${productId}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'white', color: 'black' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '3rem 0', fontSize: '18px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'white', color: 'red' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '3rem 0', fontSize: '18px', color: 'red' }}>{error}</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: 'white', color: 'black' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ fontSize: '18px', marginBottom: '0.5rem' }}>No products found for "{query}"</p>
            <p style={{ color: '#6b7280' }}>Try a different search term</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page" style={{ minHeight: '100vh', padding: '2rem 1rem', backgroundColor: 'white' }}>
      <div className="search-container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="search-results-header" style={{ marginBottom: '2rem' }}>
          <h2 className="search-results-title" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
            {products.length} {products.length === 1 ? 'result' : 'results'} for "{query}"
          </h2>
        </div>
        <div className="search-results-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {products.map((product, index) => {
            let discountPercent = undefined;
            const actualPrice = Number(product.actual_price_usd) || 0;
            const discountedPrice = Number(product.discounted_price_usd) || 0;
            
            if (product.discount_percentage) {
              discountPercent = `${Math.round(Number(product.discount_percentage))}% OFF`;
            } else if (actualPrice > 0 && discountedPrice > 0 && actualPrice > discountedPrice) {
              const calculatedDiscount = ((actualPrice - discountedPrice) / actualPrice) * 100;
              if (calculatedDiscount > 0) {
                discountPercent = `${Math.round(calculatedDiscount)}% OFF`;
              }
            }
            
            const rating = product.avg_rating || 0;
            const reviewCount = product.review_count || 0;
            const color = getRandomColor(index);

            return (
              <ProductCard
                key={product.product_id}
                title={product.product_name || 'Untitled Product'}
                price={discountedPrice}
                originalPrice={actualPrice > 0 ? actualPrice : undefined}
                rating={Number(rating) || 0}
                reviews={Number(reviewCount) || 0}
                discount={discountPercent}
                color={color}
                onClick={() => handleProductClick(product.product_id)}
                layout="horizontal"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

