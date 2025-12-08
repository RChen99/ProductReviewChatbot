from api import create_app

if __name__ == '__main__':
    app = create_app()
    PORT = 5001
    print('=' * 60)
    print(f'Starting Flask server on http://localhost:{PORT}')
    print(f'Server will run on PORT: {PORT}')
    print('=' * 60)
    print('API endpoints available at:')
    print('  - GET /api/health')
    print('  - GET /api/products/search?q=<query>')
    print('  - GET /api/products/<product_id>')
    print('=' * 60)
    app.run(debug=True, port=PORT, host='0.0.0.0')

