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
            
            like_conditions = []
            params = []
            for word in words:
                like_conditions.append("product_name LIKE %s")
                params.append(f"%{word}%")
            
            sql = f"SELECT * FROM products WHERE {' OR '.join(like_conditions)} LIMIT 20"
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
                "SELECT * FROM products WHERE product_id = %s",
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

