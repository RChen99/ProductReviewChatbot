import { Star, Gift } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  prime?: boolean;
  discount?: string;
}

export function ProductCard({ title, price, originalPrice, rating, reviews, prime = false, discount }: ProductCardProps) {
  return (
    <div className="bg-white p-6 rounded hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 relative">
      {discount && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs">
          {discount}
        </div>
      )}
      <div className="mb-4 flex items-center justify-center py-6">
        <Gift className="w-16 h-16 text-red-600" />
      </div>
      <div>
        <h3 className="mb-3 text-gray-900">{title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? 'fill-[#f08804] text-[#f08804]' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-blue-600">{reviews.toLocaleString()}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        {prime && (
          <div className="mt-2">
            <span className="text-xs bg-[#00a8e1] text-white px-2 py-1 rounded">prime</span>
          </div>
        )}
      </div>
    </div>
  );
}
