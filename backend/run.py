from api import create_app

if __name__ == '__main__':
    app = create_app()
    print('Starting Flask server on http://localhost:5001')
    print('API endpoints available at:')
    print('  - GET /api/health')
    print('  - GET /api/products/search?q=<query>')
    print('  - GET /api/products/<product_id>')
    app.run(debug=True, port=5001, host='0.0.0.0')

