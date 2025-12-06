# Product Review Chatbot

A web app for analyzing Amazon product reviews. You can search products, read reviews, and chat with a bot that answers questions about product analytics. Built with Flask and React.

## Features

- Search and browse products
- Read product reviews with ratings and sentiment scores
- Chat with a bot that can answer 8 different types of analytical questions:
  1. Top-rated products by category
  2. Sentiment analysis by price range
  3. Best value products (rating/price ratio)
  4. How review length relates to ratings
  5. Sentiment trends by category
  6. How discounts affect review quality
  7. Rating consistency across products
  8. Comparing sentiment scores vs ratings

## Tech Stack

**Backend**: Flask (Python), MySQL  
**Frontend**: React + TypeScript, Vite, Tailwind CSS

## Prerequisites

- Python 3.x
- Node.js and npm
- MySQL (5.7+ should work fine)

## Getting started

### Database setup

Make sure MySQL is running, then import the schema:

```bash
mysql -u root -p < final_project_mysql_schema.sql
```

This creates the `final_project_db` database with tables for products, users, and reviews.

**Custom database config?** Create a `.env` file in `backend/db/`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=final_project_db
```
### Install dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

## Running the Application

You'll need two terminal windows - one for backend, one for frontend.

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```

Should see something like:
```
Starting Flask server on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Once both are running, you're good to go! The app will be at http://localhost:3000.

## API endpoints

The backend runs on port 5001. Here's what's available:

**Products:**
- `GET /api/health` - Check if backend is alive
- `GET /api/products/search?q=<query>` - Search products
- `GET /api/products/<product_id>` - Get a specific product
- `GET /api/products/<product_id>/reviews?limit=5&offset=0` - Get reviews for a product

**Analytics (used by the chatbot):**
- `/api/analytics/top-rated-by-category`
- `/api/analytics/sentiment-by-price-range`
- `/api/analytics/best-value-products`
- `/api/analytics/review-length-rating`
- `/api/analytics/sentiment-by-category`
- `/api/analytics/discount-review-quality`
- `/api/analytics/rating-variance`
- `/api/analytics/sentiment-rating-comparison`


---

This is a course project (DS5110). If you run into issues or have questions, feel free to reach out.
