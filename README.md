# Product Review Chatbot

A web app for analyzing Amazon product reviews. You can search products, read reviews, and chat with a bot that answers questions about product analytics. Built with Flask and React.

## Feat

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

Nothing too fancy, just standard tools that work well together.

## What you need

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
DB_PASSWORD=your_password
DB_NAME=final_project_db
```

If you don't create this file, it'll use the defaults above (assuming localhost, root user, no password).

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

## Running it

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

This starts the frontend on http://localhost:3000 and should open your browser automatically.

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

## Project structure

Pretty straightforward:
- `backend/` - Flask API, database connection stuff
- `frontend/` - React app with pages and components
- `chatbot/` - The chatbot component (separate folder for some reason)
- `final_project_mysql_schema.sql` - Database schema
- `cleaned_amazon_reviews.csv` - Sample data

## Common issues

**Backend won't start?**
- Make sure you have Python 3.x (`python --version`)
- Check that all dependencies installed (`pip list`)
- MySQL needs to be running and the database should exist
- Read the error message - it usually tells you what's wrong

**Frontend can't reach backend?**
- Is the backend actually running? Try http://localhost:5001/api/health
- Check the browser console for errors
- Make sure `frontend/src/services/api.ts` has the right URL (should be `http://localhost:5001/api`)

**Database connection failing?**
- Is MySQL running? On macOS: `mysql.server start`
- Does the database exist? `mysql -u root -p -e "SHOW DATABASES;"`
- Check your `.env` file or try the defaults
- Test the connection: `python backend/db/db_connection.py`

**Port already in use?**
- Find what's using it: `lsof -i :5001` (macOS/Linux) or `netstat -ano | findstr :5001` (Windows)
- Kill that process or change the port in the config files

## Development notes

Backend has Flask debug mode on, so it auto-reloads when you change Python files. Frontend uses Vite's HMR, so React changes show up immediately in the browser. Pretty standard setup.

---

This is a course project (DS5110). If you run into issues or have questions, feel free to reach out.

F e a z z