import { Star, Gift } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  prime?: boolean;
  discount?: string;
  color?: 'red' | 'green' | 'grey';
  onClick?: () => void;
  layout?: 'vertical' | 'horizontal';
}

export function ProductCard({
  title,
  price,
  originalPrice,
  rating,
  reviews,
  prime = false,
  discount,
  color = 'red',
  onClick,
  layout = 'vertical'
}: ProductCardProps) {
  const badgeColorClass = color === 'green' ? 'bg-green-600' : color === 'grey' ? 'bg-gray-600' : 'bg-red-600';
  const giftColorClass = color === 'green' ? 'text-green-600' : color === 'grey' ? 'text-gray-600' : 'text-red-600';

  if (layout === 'horizontal') {
    return (
      <div className="bg-white rounded hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 relative flex" onClick={onClick} style={{ minHeight: '200px' }}>
        <div className="flex-shrink-0 flex items-center justify-center border-r border-gray-200" style={{ width: '200px', height: '200px' }}>
          <Gift className={`${giftColorClass}`} style={{ width: '150px', height: '150px' }} />
        </div>
        <div className="flex-1 p-6 text-right">
          <h3 className="mb-3 text-gray-900 text-lg font-medium">{title}</h3>
          <div className="flex items-center justify-end gap-1 mb-3">
            <span className="text-sm text-gray-900 font-medium">{Number(rating || 0).toFixed(1)}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(Number(rating || 0)) ? 'fill-[#f08804] text-[#f08804]' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-blue-600 ml-1">{reviews.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end gap-2 mb-2">
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-2xl text-gray-900 font-semibold">${Number(price || 0).toFixed(2)}</span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">${Number(originalPrice).toFixed(2)}</span>
              )}
            </div>
            {discount && (
              <div className={`${badgeColorClass} text-white px-4 py-2 rounded-full text-sm`} style={{ width: 'fit-content' }}>
                {discount}
              </div>
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

  return (
    <div className="bg-white p-6 rounded hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 relative" onClick={onClick}>
      {discount && (
        <div className={`absolute top-2 right-2 ${badgeColorClass} text-white px-4 py-2 rounded-full text-sm`}>
          {discount}
        </div>
      )}
      <div className="mb-4 flex items-center justify-center py-6">
        <Gift className={`w-16 h-16 ${giftColorClass}`} />
      </div>
      <div>
        <h3 className="mb-3 text-gray-900">{title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm text-gray-900 font-medium">{Number(rating || 0).toFixed(1)}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(Number(rating || 0)) ? 'fill-[#f08804] text-[#f08804]' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-blue-600">{reviews.toLocaleString()}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl text-gray-900">${Number(price || 0).toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">${Number(originalPrice).toFixed(2)}</span>
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
