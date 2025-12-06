# 8 Analytical SQL Queries
from flask import jsonify, request
from db.db_connection import get_db_connection

def register_routes(app):
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok', 'message': 'Backend is running'}), 200
    
    @app.route('/api/products/search', methods=['GET'])
    def search_products():
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            words = [word.strip() for word in query.split() if word.strip()]
            if not words:
                return jsonify([]), 200
            
            # Use AND logic - all words must be present
            like_conditions = []
            params = []
            for word in words:
                like_conditions.append("product_name LIKE %s")
                params.append(f"%{word}%")
            
            sql = f"""SELECT 
                product_id, 
                product_name, 
                category, 
                actual_price_usd,
                discounted_price_usd,
                discount_percentage,
                about_product,
                img_link,
                product_link
                FROM products WHERE {' AND '.join(like_conditions)} LIMIT 20"""
            cursor.execute(sql, tuple(params))
            products = cursor.fetchall()
            
            for product in products:
                product_id = product['product_id']
                cursor.execute(
                    """SELECT AVG(rating) as avg_rating, COUNT(*) as review_count 
                       FROM reviews WHERE product_id = %s""",
                    (product_id,)
                )
                rating_data = cursor.fetchone()
                product['avg_rating'] = float(rating_data['avg_rating']) if rating_data and rating_data['avg_rating'] else 0.0
                product['review_count'] = int(rating_data['review_count']) if rating_data and rating_data['review_count'] else 0
            
            cursor.close()
            conn.close()
            
            return jsonify(products), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/products/<product_id>', methods=['GET'])
    def get_product(product_id):
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute(
                """SELECT 
                    product_id, 
                    product_name, 
                    category, 
                    actual_price_usd,
                    discounted_price_usd,
                    discount_percentage,
                    about_product,
                    img_link,
                    product_link
                    FROM products WHERE product_id = %s""",
                (product_id,)
            )
            product = cursor.fetchone()
            
            if not product:
                cursor.close()
                conn.close()
                return jsonify({'error': 'Product not found'}), 404
            
            cursor.execute(
                """SELECT AVG(rating) as avg_rating, COUNT(*) as review_count 
                   FROM reviews WHERE product_id = %s""",
                (product_id,)
            )
            rating_data = cursor.fetchone()
            
            avg_rating = float(rating_data['avg_rating']) if rating_data['avg_rating'] else 0.0
            review_count = int(rating_data['review_count']) if rating_data['review_count'] else 0
            
            product['avg_rating'] = avg_rating
            product['review_count'] = review_count
            
            cursor.close()
            conn.close()
            
            return jsonify(product), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/products/<product_id>/reviews', methods=['GET'])
    def get_product_reviews(product_id):
        conn = None
        cursor = None
        try:
            limit = int(request.args.get('limit', 5))
            offset = int(request.args.get('offset', 0))
            
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT 
                    r.review_id,
                    r.review_title,
                    r.review_content,
                    r.rating,
                    r.sentiment_label,
                    u.user_name
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.user_id
                WHERE r.product_id = %s
                ORDER BY r.rating DESC, r.review_id ASC
                LIMIT %s OFFSET %s
            """, (product_id, limit, offset))
            reviews = cursor.fetchall()
            
            # Get total count for pagination
            cursor.execute(
                "SELECT COUNT(*) as total FROM reviews WHERE product_id = %s",
                (product_id,)
            )
            total_data = cursor.fetchone()
            total_count = int(total_data['total']) if total_data else 0
            
            # Format results
            for review in reviews:
                review['rating'] = float(review['rating']) if review['rating'] else 0.0
            
            result = {
                'reviews': reviews,
                'total': total_count,
                'limit': limit,
                'offset': offset,
                'has_more': (offset + len(reviews)) < total_count
            }
            
            cursor.close()
            conn.close()
            
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    # Analytics Endpoints
    @app.route('/api/analytics/top-rated-by-category', methods=['GET'])
    def top_rated_by_category():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            # Get summary stats by first category segment
            cursor.execute("""
                SELECT 
                    SUBSTRING_INDEX(p.category, '|', 1) AS first_category,
                    AVG(r.rating) as avg_rating,
                    COUNT(r.review_id) as review_count,
                    COUNT(DISTINCT p.product_id) as product_count
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE p.category IS NOT NULL AND p.category != ''
                GROUP BY first_category
                HAVING COUNT(r.review_id) >= 1
                ORDER BY avg_rating DESC
            """)
            summary_results = cursor.fetchall()

            # Get top 5 products for each first-level category
            final_results = []
            for summary in summary_results:
                first_category = summary['first_category']
                
                # Get top 5 products in this first-level category (including all subcategories)
                cursor.execute("""
                    SELECT 
                        p.product_id,
                        p.product_name,
                        AVG(r.rating) as avg_rating,
                        COUNT(r.review_id) as review_count
                    FROM products p
                    JOIN reviews r ON p.product_id = r.product_id
                    WHERE SUBSTRING_INDEX(p.category, '|', 1) = %s
                    GROUP BY p.product_id, p.product_name
                    HAVING COUNT(r.review_id) >= 1
                    ORDER BY avg_rating DESC, review_count DESC
                    LIMIT 5
                """, (first_category,))
                top_products = cursor.fetchall()
                
                # Format the result
                result = {
                    'category': first_category,
                    'avg_rating': float(summary['avg_rating']) if summary['avg_rating'] else 0.0,
                    'review_count': int(summary['review_count']) if summary['review_count'] else 0,
                    'product_count': int(summary['product_count']) if summary['product_count'] else 0,
                    'top_products': []
                }
                for product in top_products:
                    result['top_products'].append({
                        'product_id': product['product_id'],
                        'product_name': product['product_name'],
                        'avg_rating': float(product['avg_rating']) if product['avg_rating'] else 0.0,
                        'review_count': int(product['review_count']) if product['review_count'] else 0
                    })
                
                final_results.append(result)
            
            return jsonify(final_results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/sentiment-by-price-range', methods=['GET'])
    def sentiment_by_price_range():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            # Get summary stats by price range
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN p.discounted_price_usd < 50 THEN '$0-$50'
                        WHEN p.discounted_price_usd < 150 THEN '$50-$150'
                        WHEN p.discounted_price_usd < 300 THEN '$150-$300'
                        WHEN p.discounted_price_usd < 500 THEN '$300-$500'
                        ELSE '$500+'
                    END as price_range,
                    AVG(r.sentiment_score) as avg_sentiment,
                    AVG(r.rating) as avg_rating,
                    COUNT(r.review_id) as review_count
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE r.sentiment_score IS NOT NULL 
                    AND p.discounted_price_usd IS NOT NULL
                GROUP BY price_range
                ORDER BY 
                    CASE price_range
                        WHEN '$0-$50' THEN 1
                        WHEN '$50-$150' THEN 2
                        WHEN '$150-$300' THEN 3
                        WHEN '$300-$500' THEN 4
                        WHEN '$500+' THEN 5
                    END
            """)
            summary_results = cursor.fetchall()
            
            # Get top 5 products for each price range
            final_results = []
            for summary in summary_results:
                price_range = summary['price_range']
                
                # Determine price conditions
                if price_range == '$0-$50':
                    price_condition = "p.discounted_price_usd >= 0 AND p.discounted_price_usd < 50"
                elif price_range == '$50-$150':
                    price_condition = "p.discounted_price_usd >= 50 AND p.discounted_price_usd < 150"
                elif price_range == '$150-$300':
                    price_condition = "p.discounted_price_usd >= 150 AND p.discounted_price_usd < 300"
                elif price_range == '$300-$500':
                    price_condition = "p.discounted_price_usd >= 300 AND p.discounted_price_usd < 500"
                else:  # $500+
                    price_condition = "p.discounted_price_usd >= 500"
                
                # Get top 5 products in this price range
                cursor.execute(f"""
                    SELECT 
                        p.product_id,
                        p.product_name,
                        AVG(r.rating) as avg_rating,
                        COUNT(r.review_id) as review_count
                    FROM products p
                    JOIN reviews r ON p.product_id = r.product_id
                    WHERE {price_condition}
                        AND p.discounted_price_usd IS NOT NULL
                    GROUP BY p.product_id, p.product_name
                    HAVING COUNT(r.review_id) >= 1
                    ORDER BY avg_rating DESC, review_count DESC
                    LIMIT 5
                """)
                top_products = cursor.fetchall()
                
                # Format the result
                result = {
                    'price_range': price_range,
                    'avg_sentiment': float(summary['avg_sentiment']) if summary['avg_sentiment'] else 0.0,
                    'avg_rating': float(summary['avg_rating']) if summary['avg_rating'] else 0.0,
                    'review_count': int(summary['review_count']) if summary['review_count'] else 0,
                    'top_products': []
                }
                
                for product in top_products:
                    result['top_products'].append({
                        'product_id': product['product_id'],
                        'product_name': product['product_name'],
                        'avg_rating': float(product['avg_rating']) if product['avg_rating'] else 0.0,
                        'review_count': int(product['review_count']) if product['review_count'] else 0
                    })
                
                final_results.append(result)
            
            return jsonify(final_results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/best-value-products', methods=['GET'])
    def best_value_products():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT 
                    p.product_id,
                    p.product_name,
                    p.category,
                    p.discounted_price_usd,
                    AVG(r.rating) as avg_rating,
                    COUNT(r.review_id) as review_count,
                    (AVG(r.rating) / NULLIF(p.discounted_price_usd, 0)) * 1000 as value_score
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE p.discounted_price_usd IS NOT NULL
                    AND p.discounted_price_usd > 0
                    AND r.rating IS NOT NULL
                GROUP BY p.product_id, p.product_name, p.category, p.discounted_price_usd
                HAVING COUNT(r.review_id) >= 1
                ORDER BY value_score DESC, avg_rating DESC
                LIMIT 5
            """)
            results = cursor.fetchall()
            
            for result in results:
                result['avg_rating'] = float(result['avg_rating']) if result['avg_rating'] else 0.0
                result['review_count'] = int(result['review_count']) if result['review_count'] else 0
                result['discounted_price_usd'] = float(result['discounted_price_usd']) if result['discounted_price_usd'] else 0.0
                result['value_score'] = float(result['value_score']) if result['value_score'] else 0.0
            
            return jsonify(results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/review-length-rating', methods=['GET'])
    def review_length_rating():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            # Get summary stats by length category
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN r.review_length < 100 THEN 'Short (<100 chars)'
                        WHEN r.review_length < 500 THEN 'Medium (100-500 chars)'
                        WHEN r.review_length < 1000 THEN 'Long (500-1000 chars)'
                        ELSE 'Very Long (1000+ chars)'
                    END as length_category,
                    AVG(r.rating) as avg_rating,
                    AVG(r.sentiment_score) as avg_sentiment,
                    AVG(r.review_length) as avg_length,
                    COUNT(r.review_id) as review_count
                FROM reviews r
                WHERE r.review_length IS NOT NULL AND r.rating IS NOT NULL
                GROUP BY length_category
                ORDER BY 
                    CASE length_category
                        WHEN 'Short (<100 chars)' THEN 1
                        WHEN 'Medium (100-500 chars)' THEN 2
                        WHEN 'Long (500-1000 chars)' THEN 3
                        ELSE 4
                    END
            """)
            summary_results = cursor.fetchall()
            
            # Get top 5 products for each length category
            final_results = []
            for summary in summary_results:
                length_category = summary['length_category']
                
                # Determine length conditions
                if length_category == 'Short (<100 chars)':
                    length_condition = "r.review_length < 100"
                elif length_category == 'Medium (100-500 chars)':
                    length_condition = "r.review_length >= 100 AND r.review_length < 500"
                elif length_category == 'Long (500-1000 chars)':
                    length_condition = "r.review_length >= 500 AND r.review_length < 1000"
                else:  # Very Long (1000+ chars)
                    length_condition = "r.review_length >= 1000"
                
                # Get top 5 products in this length category
                cursor.execute(f"""
                    SELECT 
                        p.product_id,
                        p.product_name,
                        AVG(r.rating) as avg_rating,
                        COUNT(r.review_id) as review_count
                    FROM products p
                    JOIN reviews r ON p.product_id = r.product_id
                    WHERE {length_condition}
                        AND r.review_length IS NOT NULL
                        AND r.rating IS NOT NULL
                    GROUP BY p.product_id, p.product_name
                    HAVING COUNT(r.review_id) >= 1
                    ORDER BY avg_rating DESC, review_count DESC
                    LIMIT 5
                """)
                top_products = cursor.fetchall()
                
                # Format the result
                result = {
                    'length_category': length_category,
                    'avg_rating': float(summary['avg_rating']) if summary['avg_rating'] else 0.0,
                    'avg_sentiment': float(summary['avg_sentiment']) if summary['avg_sentiment'] else 0.0,
                    'avg_length': float(summary['avg_length']) if summary['avg_length'] else 0.0,
                    'review_count': int(summary['review_count']) if summary['review_count'] else 0,
                    'top_products': []
                }
                
                for product in top_products:
                    result['top_products'].append({
                        'product_id': product['product_id'],
                        'product_name': product['product_name'],
                        'avg_rating': float(product['avg_rating']) if product['avg_rating'] else 0.0,
                        'review_count': int(product['review_count']) if product['review_count'] else 0
                    })
                
                final_results.append(result)
            
            return jsonify(final_results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/sentiment-by-category', methods=['GET'])
    def sentiment_by_category():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            # Get summary stats by first category segment
            cursor.execute("""
                SELECT 
                    SUBSTRING_INDEX(p.category, '|', 1) AS first_category,
                    AVG(r.sentiment_score) as avg_sentiment,
                    AVG(r.rating) as avg_rating,
                    COUNT(r.review_id) as review_count,
                    COUNT(DISTINCT p.product_id) as product_count
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE p.category IS NOT NULL 
                    AND p.category != ''
                    AND r.sentiment_score IS NOT NULL
                GROUP BY first_category
                HAVING COUNT(r.review_id) >= 1
                ORDER BY avg_sentiment DESC
            """)
            summary_results = cursor.fetchall()
            
            # Get top 5 products for each first-level category
            final_results = []
            for summary in summary_results:
                first_category = summary['first_category']
                
                # Get top 5 products in this first-level category (including all subcategories)
                cursor.execute("""
                    SELECT 
                        p.product_id,
                        p.product_name,
                        AVG(r.rating) as avg_rating,
                        COUNT(r.review_id) as review_count
                    FROM products p
                    JOIN reviews r ON p.product_id = r.product_id
                    WHERE SUBSTRING_INDEX(p.category, '|', 1) = %s
                        AND r.sentiment_score IS NOT NULL
                    GROUP BY p.product_id, p.product_name
                    HAVING COUNT(r.review_id) >= 1
                    ORDER BY avg_rating DESC, review_count DESC
                    LIMIT 5
                """, (first_category,))
                top_products = cursor.fetchall()
                
                # Format the result
                result = {
                    'category': first_category,
                    'avg_sentiment': float(summary['avg_sentiment']) if summary['avg_sentiment'] else 0.0,
                    'avg_rating': float(summary['avg_rating']) if summary['avg_rating'] else 0.0,
                    'review_count': int(summary['review_count']) if summary['review_count'] else 0,
                    'product_count': int(summary['product_count']) if summary['product_count'] else 0,
                    'top_products': []
                }
                
                for product in top_products:
                    result['top_products'].append({
                        'product_id': product['product_id'],
                        'product_name': product['product_name'],
                        'avg_rating': float(product['avg_rating']) if product['avg_rating'] else 0.0,
                        'review_count': int(product['review_count']) if product['review_count'] else 0
                    })
                
                final_results.append(result)
            
            return jsonify(final_results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/discount-review-quality', methods=['GET'])
    def discount_review_quality():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            # Get summary stats by discount range
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN p.discount_percentage < 25 THEN '0-25% off'
                        WHEN p.discount_percentage < 50 THEN '25-50% off'
                        WHEN p.discount_percentage < 75 THEN '50-75% off'
                        ELSE '75%+ off'
                    END as discount_range,
                    AVG(r.rating) as avg_rating,
                    AVG(r.sentiment_score) as avg_sentiment,
                    COUNT(r.review_id) as review_count,
                    COUNT(DISTINCT p.product_id) as product_count
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE p.discount_percentage IS NOT NULL
                    AND r.rating IS NOT NULL
                GROUP BY discount_range
                ORDER BY 
                    CASE discount_range
                        WHEN '0-25% off' THEN 1
                        WHEN '25-50% off' THEN 2
                        WHEN '50-75% off' THEN 3
                        ELSE 4
                    END
            """)
            summary_results = cursor.fetchall()
            
            # Get top 5 products for each discount range
            final_results = []
            for summary in summary_results:
                discount_range = summary['discount_range']
                
                # Determine discount conditions
                if discount_range == '0-25% off':
                    discount_condition = "p.discount_percentage < 25"
                elif discount_range == '25-50% off':
                    discount_condition = "p.discount_percentage >= 25 AND p.discount_percentage < 50"
                elif discount_range == '50-75% off':
                    discount_condition = "p.discount_percentage >= 50 AND p.discount_percentage < 75"
                else:  # 75%+ off
                    discount_condition = "p.discount_percentage >= 75"
                
                # Get top 5 products in this discount range
                cursor.execute(f"""
                    SELECT 
                        p.product_id,
                        p.product_name,
                        AVG(r.rating) as avg_rating,
                        COUNT(r.review_id) as review_count
                    FROM products p
                    JOIN reviews r ON p.product_id = r.product_id
                    WHERE {discount_condition}
                        AND p.discount_percentage IS NOT NULL
                        AND r.rating IS NOT NULL
                    GROUP BY p.product_id, p.product_name
                    HAVING COUNT(r.review_id) >= 1
                    ORDER BY avg_rating DESC, review_count DESC
                    LIMIT 5
                """)
                top_products = cursor.fetchall()
                
                # Format the result
                result = {
                    'discount_range': discount_range,
                    'avg_rating': float(summary['avg_rating']) if summary['avg_rating'] else 0.0,
                    'avg_sentiment': float(summary['avg_sentiment']) if summary['avg_sentiment'] else 0.0,
                    'review_count': int(summary['review_count']) if summary['review_count'] else 0,
                    'product_count': int(summary['product_count']) if summary['product_count'] else 0,
                    'top_products': []
                }
                
                for product in top_products:
                    result['top_products'].append({
                        'product_id': product['product_id'],
                        'product_name': product['product_name'],
                        'avg_rating': float(product['avg_rating']) if product['avg_rating'] else 0.0,
                        'review_count': int(product['review_count']) if product['review_count'] else 0
                    })
                
                final_results.append(result)
            
            return jsonify(final_results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/rating-variance', methods=['GET'])
    def rating_variance():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT 
                    p.product_id,
                    p.product_name,
                    p.category,
                    AVG(r.rating) as avg_rating,
                    STDDEV_POP(r.rating) as rating_stddev,
                    COUNT(r.review_id) as review_count,
                    MIN(r.rating) as min_rating,
                    MAX(r.rating) as max_rating
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE r.rating IS NOT NULL
                GROUP BY p.product_id, p.product_name, p.category
                HAVING COUNT(r.review_id) >= 1
                ORDER BY rating_stddev ASC, avg_rating DESC
                LIMIT 20
            """)
            results = cursor.fetchall()
            
            for result in results:
                result['avg_rating'] = float(result['avg_rating']) if result['avg_rating'] else 0.0
                result['rating_stddev'] = float(result['rating_stddev']) if result['rating_stddev'] else 0.0
                result['review_count'] = int(result['review_count']) if result['review_count'] else 0
                result['min_rating'] = float(result['min_rating']) if result['min_rating'] else 0.0
                result['max_rating'] = float(result['max_rating']) if result['max_rating'] else 0.0
            
            return jsonify(results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    @app.route('/api/analytics/sentiment-rating-comparison', methods=['GET'])
    def sentiment_rating_comparison():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT 
                    p.product_id,
                    p.product_name,
                    p.category,
                    AVG(r.rating) as avg_rating,
                    AVG(r.sentiment_score) as avg_sentiment,
                    COUNT(r.review_id) as review_count,
                    CASE 
                        WHEN AVG(r.sentiment_score) > AVG(r.rating) / 5.0 * 1.0 THEN 'Sentiment Higher'
                        WHEN AVG(r.sentiment_score) < AVG(r.rating) / 5.0 * 0.8 THEN 'Rating Higher'
                        ELSE 'Aligned'
                    END as comparison
                FROM products p
                JOIN reviews r ON p.product_id = r.product_id
                WHERE r.rating IS NOT NULL 
                    AND r.sentiment_score IS NOT NULL
                GROUP BY p.product_id, p.product_name, p.category
                HAVING COUNT(r.review_id) >= 1
                ORDER BY ABS(AVG(r.sentiment_score) - (AVG(r.rating) / 5.0)) DESC
                LIMIT 30
            """)
            results = cursor.fetchall()
            
            for result in results:
                result['avg_rating'] = float(result['avg_rating']) if result['avg_rating'] else 0.0
                result['avg_sentiment'] = float(result['avg_sentiment']) if result['avg_sentiment'] else 0.0
                result['review_count'] = int(result['review_count']) if result['review_count'] else 0
            
            return jsonify(results), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

