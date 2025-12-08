const API_BASE_URL = 'http://localhost:5001/api';

export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  actual_price_usd: number;
  discounted_price_usd: number;
  discount_percentage: number;
  about_product: string;
  img_link: string;
  product_link: string;
  avg_rating?: number;
  review_count?: number;
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Search failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5001.');
    }
    throw error;
  }
}

export async function getProductById(productId: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Product not found: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5001.');
    }
    throw error;
  }
}

export interface Review {
  review_id: string;
  review_title: string | null;
  review_content: string | null;
  rating: number;
  sentiment_label: string | null;
  user_name: string | null;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export async function getProductReviews(productId: string, limit: number = 5, offset: number = 0): Promise<ReviewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch reviews: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

// Analytics API Functions
export async function getTopRatedByCategory() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/top-rated-by-category`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching top rated by category:', error);
    throw error;
  }
}

export async function getSentimentByPriceRange() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/sentiment-by-price-range`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sentiment by price range:', error);
    throw error;
  }
}

export async function getBestValueProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/best-value-products`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching best value products:', error);
    throw error;
  }
}

export async function getReviewLengthRating() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/review-length-rating`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching review length rating:', error);
    throw error;
  }
}

export async function getSentimentByCategory() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/sentiment-by-category`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sentiment by category:', error);
    throw error;
  }
}

export async function getDiscountReviewQuality() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/discount-review-quality`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching discount review quality:', error);
    throw error;
  }
}

export async function getRatingVariance() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/rating-variance`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rating variance:', error);
    throw error;
  }
}

export async function getSentimentRatingComparison() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/sentiment-rating-comparison`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sentiment rating comparison:', error);
    throw error;
  }
}

