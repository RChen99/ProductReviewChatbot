DROP DATABASE IF EXISTS final_project_db;
CREATE DATABASE final_project_db;
USE final_project_db;

CREATE TABLE products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT,
    actual_price DECIMAL(10,2),
    discounted_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2),
    about_product TEXT,
    img_link TEXT,
    product_link TEXT
);
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    user_name TEXT
);

CREATE TABLE reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(product_id),
    user_id VARCHAR(50) REFERENCES users(user_id),
    review_title TEXT,
    review_content TEXT,
    rating DECIMAL(3,2),
    sentiment_score DECIMAL(4,3),
    sentiment_label VARCHAR(10),
    review_length INT,
    rating_count INT
);