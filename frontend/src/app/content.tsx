// @ts-nocheck
import React from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { Laptop, Shirt, Home, Gamepad2 } from 'lucide-react';

export function Products() {
  const categories = [
    {
      title: 'Electronics & Gadgets',
      icon: Laptop,
      description: 'Perfect tech gifts for everyone'
    },
    {
      title: 'Fashion & Accessories',
      icon: Shirt,
      description: 'Holiday outfits and more'
    },
    {
      title: 'Home & Decor',
      icon: Home,
      description: 'Cozy up your space'
    },
    {
      title: 'Toys & Entertainment',
      icon: Gamepad2,
      description: 'Fun for the whole family'
    }
  ];

  const holidayDeals = [
    {
      id: 1,
      title: 'Premium Laptop Computer - 15.6" Display, Intel i7, 16GB RAM',
      price: 974.99,
      originalPrice: 1299.99,
      rating: 4.5,
      reviews: 2543,
      prime: true,
      discount: '25% OFF'
    },
    {
      id: 2,
      title: '27" 4K Ultra HD Monitor - IPS Display with HDR Support',
      price: 244.99,
      originalPrice: 349.99,
      rating: 4.7,
      reviews: 8456,
      prime: true,
      discount: '30% OFF'
    },
    {
      id: 3,
      title: 'Professional DSLR Camera with 18-55mm Lens Kit',
      price: 449.99,
      originalPrice: 749.99,
      rating: 4.3,
      reviews: 1823,
      prime: true,
      discount: '40% OFF'
    },
    {
      id: 4,
      title: 'Smartwatch with Fitness Tracking & Heart Rate Monitor',
      price: 149.99,
      originalPrice: 299.99,
      rating: 4.2,
      reviews: 4030,
      prime: true,
      discount: '50% OFF'
    },
    {
      id: 5,
      title: 'Bluetooth Wireless Speaker - 360° Sound with Bass Boost',
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviews: 3421,
      prime: true,
      discount: '28% OFF'
    },
    {
      id: 6,
      title: 'Wireless Gaming Controller - Ergonomic Design with RGB Lighting',
      price: 45.99,
      originalPrice: 99.99,
      rating: 4.1,
      reviews: 5298,
      prime: true,
      discount: '54% OFF'
    }
  ];

  const giftIdeas = [
    {
      id: 7,
      title: '55" 4K Ultra HD Smart TV - HDR10 with Voice Control',
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.5,
      reviews: 2134,
      prime: true,
      discount: '28% OFF'
    },
    {
      id: 8,
      title: 'Wireless Bluetooth Earbuds - Premium Sound Quality & Noise Cancellation',
      price: 58.99,
      originalPrice: 120.99,
      rating: 4.0,
      reviews: 203,
      prime: true,
      discount: '51% OFF'
    },
    {
      id: 9,
      title: 'Elgato Stream Deck - 16 Programmable LCD Buttons for Content Creators',
      price: 149.99,
      originalPrice: 229.99,
      rating: 4.4,
      reviews: 4328,
      prime: true,
      discount: '35% OFF'
    },
    {
      id: 10,
      title: 'Portable External Hard Drive - 2TB USB 3.0 High-Speed Storage',
      price: 82.99,
      originalPrice: 149.99,
      rating: 4.5,
      reviews: 1876,
      prime: true,
      discount: '45% OFF'
    }
  ];

  return (
    <>
      {/* Categories Section */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            // @ts-ignore
            <CategoryCard
              key={index}
              title={category.title}
              icon={category.icon}
              description={category.description}
              color={index % 2 === 0 ? 'red' : 'green'}
            />
          ))}
        </div>
      </section>

      {/* Holiday Deals */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4 text-gray-900">Holiday Deals - Limited Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {holidayDeals.map((product, index) => (
              // @ts-ignore
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                prime={product.prime}
                discount={product.discount}
                color={index % 2 === 0 ? 'red' : 'green'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gift Ideas */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4 text-gray-900">Perfect Gift Ideas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {giftIdeas.map((product, index) => (
              // @ts-ignore
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                prime={product.prime}
                discount={product.discount}
                color={index % 2 === 0 ? 'red' : 'green'}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

