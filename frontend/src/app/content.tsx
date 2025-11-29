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
      price: 899.99,
      originalPrice: 1299.99,
      rating: 4.5,
      reviews: 2543,
      prime: true,
      discount: '31% OFF'
    },
    {
      id: 2,
      title: 'Wireless Noise Cancelling Headphones - Studio Quality Sound',
      price: 249.99,
      originalPrice: 349.99,
      rating: 4.7,
      reviews: 8456,
      prime: true,
      discount: '29% OFF'
    },
    {
      id: 3,
      title: 'Professional DSLR Camera with 18-55mm Lens Kit',
      price: 649.99,
      originalPrice: 899.99,
      rating: 4.6,
      reviews: 1823,
      prime: true,
      discount: '28% OFF'
    },
    {
      id: 4,
      title: 'Smartwatch with Fitness Tracking & Heart Rate Monitor',
      price: 199.99,
      originalPrice: 299.99,
      rating: 4.4,
      reviews: 5621,
      prime: true,
      discount: '33% OFF'
    },
    {
      id: 5,
      title: 'Multi-Function Kitchen Stand Mixer - 6 Speed Settings',
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.8,
      reviews: 3421,
      prime: true,
      discount: '28% OFF'
    },
    {
      id: 6,
      title: 'Best Selling Books Collection - Top 10 Fiction Novels',
      price: 89.99,
      originalPrice: 149.99,
      rating: 4.9,
      reviews: 12456,
      prime: true,
      discount: '40% OFF'
    }
  ];

  const giftIdeas = [
    {
      id: 7,
      title: 'Modern Home Decor Set - Minimalist Design for Living Room',
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.5,
      reviews: 2134,
      prime: true,
      discount: '28% OFF'
    },
    {
      id: 8,
      title: 'Designer Fashion Collection - Premium Cotton Basics',
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.3,
      reviews: 956,
      prime: false,
      discount: '33% OFF'
    },
    {
      id: 9,
      title: 'Advanced Fitness Tracker - GPS & Sleep Monitoring',
      price: 149.99,
      originalPrice: 229.99,
      rating: 4.6,
      reviews: 4231,
      prime: true,
      discount: '35% OFF'
    },
    {
      id: 10,
      title: 'Stainless Steel Blender - 1000W Professional Grade',
      price: 99.99,
      originalPrice: 149.99,
      rating: 4.7,
      reviews: 1876,
      prime: true,
      discount: '33% OFF'
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
            />
          ))}
        </div>
      </section>

      {/* Holiday Deals */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4 text-gray-900">Holiday Deals - Limited Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {holidayDeals.map((product) => (
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
            {giftIdeas.map((product) => (
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
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

