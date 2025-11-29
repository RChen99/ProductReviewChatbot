// @ts-nocheck
import React from 'react';
import { Star, Shield, RotateCcw, Truck, Gift, MapPin } from 'lucide-react';
import { useState } from 'react';
import './product.css';

// Product Page Component with Dummy Data
export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const giftIcons = [
    { color: 'gift-icon-gray' },
    { color: 'gift-icon-red' },
    { color: 'gift-icon-green' }
  ];

  // Dummy product data
  const product = {
    name: 'Test Product',
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.5,
    reviews: 8456,
    inStock: true
  };

  // Calculate delivery date (3 days from today)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3);
  const deliveryDateString = deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate discount
  const discount = ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0);
  const savings = product.originalPrice - product.price;

  // Round rating down for star display
  const fullStars = Math.floor(product.rating);

  return (
    <div className="product-page">
      {/* Product Page Content */}
      <div className="product-container">
        <div className="product-grid">
          {/* Left Column - Gift Icons */}
          <div className="product-image-column">
            <div className="product-image-container">
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
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating-container">
              <div className="product-rating-stars">
                <span className="product-rating-number">{product.rating.toFixed(1)}</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fullStars ? 'product-star-filled' : 'product-star-empty'
                    }`}
                  />
                ))}
              </div>
              <span className="product-rating-count">{product.reviews.toLocaleString()} ratings</span>
            </div>
            <hr className="product-divider" />
            <div className="product-price-section">
              <div className="flex items-baseline gap-2">
                <span className="product-price-label">Price:</span>
                <span className="product-price">${product.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
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
          </div>

          {/* Right Column - Buy Box */}
          <div className="product-buy-box-column">
            <div className="product-buy-box">
              <div className="product-buy-box-price">
                ${product.price.toFixed(2)}
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
                <button className="product-button product-button-add-cart">
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

