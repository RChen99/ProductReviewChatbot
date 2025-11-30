// @ts-nocheck
import React from 'react';
import { Star, Shield, RotateCcw, Truck, Gift, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts, getProductById, Product } from '../../services/api';
import { useProductContext, useCartContext } from '../layout';
import './product.css';

export default function ProductPage() {
  const { setCurrentProduct } = useProductContext();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const giftIcons = [
    { color: 'gift-icon-gray' },
    { color: 'gift-icon-red' },
    { color: 'gift-icon-green' }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const query = searchParams.get('q');
        const productId = searchParams.get('product_id');
        
        if (productId) {
          const productData = await getProductById(productId);
          setProduct(productData);
          setCurrentProduct(productData);
        } else if (query) {
          const products = await searchProducts(query);
          if (products.length === 0) {
            setError('Product not found');
            setCurrentProduct(null);
          } else if (products.length === 1) {
            const firstProduct = await getProductById(products[0].product_id);
            setProduct(firstProduct);
            setCurrentProduct(firstProduct);
          } else {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            return;
          }
        } else {
          setError('No product specified');
          setCurrentProduct(null);
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load product';
        setError(errorMessage);
        setCurrentProduct(null);
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [searchParams, setCurrentProduct]);

  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);
  const deliveryDateString = deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  if (loading) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="text-center py-12 text-red-600">{error || 'Product not found'}</div>
        </div>
      </div>
    );
  }

  const price = Number(product.discounted_price) || 0;
  const originalPrice = Number(product.actual_price) || 0;
  const discount = originalPrice > 0 ? ((originalPrice - price) / originalPrice * 100).toFixed(0) : '0';
  const savings = originalPrice - price;
  const rating = Number(product.avg_rating) || 0;
  const reviewCount = Number(product.review_count) || 0;
  const fullStars = Math.floor(rating);

  return (
    <div className="product-page">
      {/* Product Page Content */}
      <div className="product-container">
        <div className="product-grid">
          {/* Left Column - Gift Icons */}
          <div className="product-image-column">
            <div className="product-image-container">
              {/* Category Section */}
              <div className="product-category-section">
                <span className="product-category-value">{product.category || 'Uncategorized'}</span>
              </div>
              {/* Main Gift Icon */}
              <div className="product-main-image">
                <Gift className={`${giftIcons[selectedImage].color}`} style={{ width: '200px', height: '200px' }} />
              </div>
              {/* Thumbnail Gift Icons */}
              <div className="product-thumbnails">
                {giftIcons.map((icon, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`product-thumbnail ${selectedImage === idx ? 'selected' : ''}`}
                  >
                    <Gift className={icon.color} style={{ width: '100px', height: '100px' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Product Details */}
          <div className="product-details-column">
            <h1 className="product-title">{product.product_name}</h1>
            <div className="product-rating-container">
              <div className="product-rating-stars">
                <span className="product-rating-number">{rating.toFixed(1)}</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fullStars ? 'product-star-filled' : 'product-star-empty'
                    }`}
                  />
                ))}
              </div>
              <span className="product-rating-count">{reviewCount.toLocaleString()} ratings</span>
            </div>
            <hr className="product-divider" />
            <div className="product-price-section">
              <div className="flex items-baseline gap-2">
                <span className="product-price-label">Price:</span>
                <span className="product-price">${price.toFixed(2)}</span>
              </div>
              <div>
                <span className="product-original-price">${originalPrice.toFixed(2)}</span>
                <span className="product-savings">Save ${savings.toFixed(2)} ({discount}%)</span>
              </div>
            </div>
            <hr className="product-divider" />
            <div className="product-delivery-section">
              <div className="product-delivery-item">
                <Truck className="product-delivery-icon product-delivery-teal" />
                <div>
                  <span className="product-delivery-teal">FREE delivery</span>
                  <span> {deliveryDateString}</span>
                </div>
              </div>
              <div className="product-delivery-item">
                <MapPin className="product-delivery-icon" />
                <div>
                  <span>Deliver to Boston 02108</span>
                </div>
              </div>
            </div>
            <div className="product-stock">
              In Stock
            </div>
            {product.about_product && (
              <div className="product-about-section">
                <h2 className="product-about-title">About this item</h2>
                <div className="product-about-content">
                  {product.about_product}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Buy Box */}
          <div className="product-buy-box-column">
            <div className="product-buy-box">
              <div className="product-buy-box-price">
                ${price.toFixed(2)}
              </div>
              <div className="product-delivery-item">
                <Truck className="product-delivery-icon product-delivery-teal" />
                <div>
                  <span className="product-delivery-teal">FREE delivery</span>
                  <span> {deliveryDateString}</span>
                </div>
              </div>
              <div className="product-delivery-item">
                <MapPin className="product-delivery-icon" />
                <span>Deliver to Boston 02108</span>
              </div>
              <div className="product-stock">
                In Stock
              </div>
              <div className="product-quantity-section">
                <label className="product-quantity-label">
                  Quantity:
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="product-quantity-select"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="product-button-container">
                <button 
                  className="product-button product-button-add-cart"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart();
                    }
                  }}
                >
                  Add to Cart
                </button>
                <button className="product-button product-button-buy-now">
                  Buy Now
                </button>
              </div>
              <hr className="product-divider" />
              <div className="product-features">
                <div className="product-feature-item">
                  <Shield className="product-feature-icon" />
                  <span>Secure transaction</span>
                </div>
                <div className="product-feature-item">
                  <RotateCcw className="product-feature-icon" />
                  <span>Easy returns</span>
                </div>
              </div>
              <div className="product-seller-info">
                <span className="product-seller-label">Ships from</span> Amazon
              </div>
              <div className="product-seller-info">
                <span className="product-seller-label">Sold by</span> Amazon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

