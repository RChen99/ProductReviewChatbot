from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])
    
    from api.routes import register_routes
    register_routes(app)
    
    return app

