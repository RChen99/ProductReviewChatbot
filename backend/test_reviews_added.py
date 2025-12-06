"""
Script to test if reviews have been added to amazon.csv
"""

import csv
import os

# Paths
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "amazon.csv")
BACKUP_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "amazon_backup.csv")

def count_reviews_in_row(row):
    """Count the number of reviews in a row"""
    review_ids = row.get('review_id', '').split(',')
    return len([r for r in review_ids if r.strip()])

def main():
    """Test if reviews were added"""
    print("=" * 60)
    print("Testing Review Addition")
    print("=" * 60)
    
    # Check if backup exists
    if not os.path.exists(BACKUP_PATH):
        print(f"\n❌ Backup file not found: {BACKUP_PATH}")
        print("   The script may not have been run yet.")
        return
    
    # Count reviews in backup (before)
    print(f"\n📊 Reading backup file: {BACKUP_PATH}")
    backup_rows = []
    with open(BACKUP_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        backup_rows = list(reader)
    
    total_before = 0
    products_with_reviews_before = 0
    for row in backup_rows:
        count = count_reviews_in_row(row)
        total_before += count
        if count > 0:
            products_with_reviews_before += 1
    
    # Count reviews in current file (after)
    print(f"📊 Reading current file: {CSV_PATH}")
    current_rows = []
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        current_rows = list(reader)
    
    total_after = 0
    products_with_reviews_after = 0
    review_counts = []
    for row in current_rows:
        count = count_reviews_in_row(row)
        total_after += count
        review_counts.append(count)
        if count > 0:
            products_with_reviews_after += 1
    
    # Calculate statistics
    reviews_added = total_after - total_before
    num_products = len(current_rows)
    avg_reviews_per_product = total_after / num_products if num_products > 0 else 0
    avg_reviews_added = reviews_added / num_products if num_products > 0 else 0
    
    # Display results
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(f"\n📦 Total Products: {num_products}")
    print(f"\n📝 Reviews:")
    print(f"   Before: {total_before:,}")
    print(f"   After:  {total_after:,}")
    print(f"   Added:  {reviews_added:,}")
    print(f"\n📊 Statistics:")
    print(f"   Average reviews per product: {avg_reviews_per_product:.2f}")
    print(f"   Average reviews added per product: {avg_reviews_added:.2f}")
    print(f"   Products with reviews (before): {products_with_reviews_before}")
    print(f"   Products with reviews (after): {products_with_reviews_after}")
    
    # Show review count distribution
    if review_counts:
        min_reviews = min(review_counts)
        max_reviews = max(review_counts)
        print(f"\n📈 Review Count Range:")
        print(f"   Minimum: {min_reviews}")
        print(f"   Maximum: {max_reviews}")
    
    # Show sample products
    print(f"\n🔍 Sample Products (first 5):")
    for i, row in enumerate(current_rows[:5]):
        product_name = row.get('product_name', 'N/A')[:50]
        review_count = count_reviews_in_row(row)
        print(f"   {i+1}. {product_name}... ({review_count} reviews)")
    
    # Verify by checking a specific row
    print(f"\n✅ Verification:")
    if reviews_added > 0:
        print(f"   ✓ Reviews were successfully added!")
        print(f"   ✓ {reviews_added:,} new reviews across {num_products} products")
    else:
        print(f"   ⚠ No reviews were added (or backup is the same as current)")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()


