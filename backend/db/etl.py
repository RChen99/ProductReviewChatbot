"""
ETL script to load data from cleaned_amazon_reviews.csv into MySQL.

Requirements:
- DB schema already created (products, users, reviews tables).
- Environment variables for DB connection set (see db_connection.py).
- mysql-connector-python installed.

Run from project root or backend folder, e.g.:
    cd backend
    python etl.py
"""

import csv
import os
from typing import Optional

from db_connection import get_db_connection


CSV_PATH_DEFAULT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "cleaned_amazon_reviews.csv",
)


def _safe_float(value: str) -> Optional[float]:
    value = value.strip()
    if value == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def _safe_int(value: str) -> Optional[int]:
    value = value.strip()
    if value == "":
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def run_etl(csv_path: str = CSV_PATH_DEFAULT) -> None:
    """
    Read the cleaned_amazon_reviews.csv file and populate
    products, users and reviews tables.

    NOTE: The CSV stores multiple users / reviews for a product
    in comma-separated lists. This ETL processes ALL reviews
    from each row and inserts them as separate review records.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            product_id = row["product_id"]

            # --- PRODUCTS ---
            product_sql = """
                INSERT INTO products (
                    product_id, product_name, category,
                    actual_price_usd, discounted_price_usd, discount_percentage,
                    about_product, img_link, product_link
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE
                    product_name = VALUES(product_name),
                    category = VALUES(category),
                    actual_price_usd = VALUES(actual_price_usd),
                    discounted_price_usd = VALUES(discounted_price_usd),
                    discount_percentage = VALUES(discount_percentage),
                    about_product = VALUES(about_product),
                    img_link = VALUES(img_link),
                    product_link = VALUES(product_link)
            """

            category = row.get("category", "")
            if category:
                category = category.replace(",", "|")
            
            about_product = row.get("about_product", "")
            if about_product:
                about_product = about_product.replace("|", ". ")
            
            cursor.execute(
                product_sql,
                (
                    product_id,
                    row["product_name"],
                    category,
                    _safe_float(row.get("actual_price_usd", "")),
                    _safe_float(row.get("discounted_price_usd", "")),
                    _safe_float(row.get("discount_percentage", "")),
                    about_product,
                    row.get("img_link"),
                    row.get("product_link"),
                ),
            )

            # --- USERS and REVIEWS (process ALL reviews) ---
            user_ids = [u.strip() for u in row.get("user_id", "").split(",") if u.strip()]
            user_names = [u.strip() for u in row.get("user_name", "").split(",") if u.strip()]
            review_ids = [r.strip() for r in row.get("review_id", "").split(",") if r.strip()]
            review_titles = [r.strip() for r in row.get("review_title", "").split(",") if r.strip()]
            review_contents = [
                r.strip() for r in row.get("review_content", "").split(",") if r.strip()
            ]

            if not review_ids:
                # No reviews for this product; skip
                continue

            # Get product-level rating (used for all reviews if individual ratings not available)
            rating_value = _safe_float(row.get("rating", ""))
            # Keep the actual decimal rating value, clamped between 1.0 and 5.0
            rating_float: Optional[float] = None
            if rating_value is not None:
                rating_float = max(1.0, min(5.0, float(rating_value)))

            # Process each review
            num_reviews = len(review_ids)
            for i in range(num_reviews):
                # Get user for this review (match by index)
                if i < len(user_ids):
                    user_id = user_ids[i]
                    user_name = user_names[i] if i < len(user_names) else None
                else:
                    # Fallback to first user if not enough users
                    user_id = user_ids[0] if user_ids else None
                    user_name = user_names[0] if user_names else None

                if not user_id:
                    continue

                # Insert/update user
                user_sql = """
                    INSERT INTO users (user_id, user_name)
                    VALUES (%s, %s)
                    ON DUPLICATE KEY UPDATE
                        user_name = VALUES(user_name)
                """
                cursor.execute(user_sql, (user_id, user_name))

                # Get review data for this review
                review_id = review_ids[i]
                review_title = review_titles[i] if i < len(review_titles) else None
                review_content = review_contents[i] if i < len(review_contents) else None

                # Calculate review_length for this specific review
                review_length = len(review_content) if review_content else 0

                # Get sentiment_score if available (might be per-review or per-product)
                # For now, use product-level sentiment_score for all reviews
                sentiment_score = _safe_float(row.get("sentiment_score", ""))

                # Insert/update review
                review_sql = """
                    INSERT INTO reviews (
                        review_id, product_id, user_id,
                        review_title, review_content,
                        rating, sentiment_score, sentiment_label,
                        review_length, review_date
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    ON DUPLICATE KEY UPDATE
                        review_title = VALUES(review_title),
                        review_content = VALUES(review_content),
                        rating = VALUES(rating),
                        sentiment_score = VALUES(sentiment_score),
                        sentiment_label = VALUES(sentiment_label),
                        review_length = VALUES(review_length)
                """

                cursor.execute(
                    review_sql,
                    (
                        review_id,
                        product_id,
                        user_id,
                        review_title,
                        review_content,
                        rating_float,
                        sentiment_score,
                        row.get("sentiment_label"),
                        review_length,
                        None,  # review_date not available in CSV
                    ),
                )

    conn.commit()
    cursor.close()
    conn.close()


if __name__ == "__main__":
    print(f"Running ETL using CSV: {CSV_PATH_DEFAULT}")
    run_etl()
    print("ETL completed.")


