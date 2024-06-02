# scripts/post_grocery_data_script.py

from post_grocery_data import upsert_data_with_single_id

def post_data(user_id, items):
    # Call the upsert function to insert data into the database
    result, status_code = upsert_data_with_single_id(user_id, items)
    
    if status_code != 201:
        print(f"Error posting data: {result['error']}")
    else:
        print(f"Data posted successfully for user {user_id}")

### Write receipt scanner code here and call post_data with the extracted data
### Extracted data should be in the format of the items list below which is a list of dictionaries

# Example usage
if __name__ == '__main__':
    user_id = "4"  # Replace with the user_id you want to use
    items = [
        {"item": "salmon", "quantity": "15", "category": "fish", "purchase_date": "2024-06-05", "expiry_date": "2024-06-12"},
        {"item": "broccoli", "quantity": "5", "category": "vegetable", "purchase_date": "2024-06-05", "expiry_date": "2024-06-12"}
    ]
    post_data(user_id, items)
