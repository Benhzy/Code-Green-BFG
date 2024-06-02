import psycopg2
from psycopg2 import sql

def upsert_data_with_single_id(document_id, items):
    # Database connection parameters
    conn_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "00edward00",
        "host": "localhost",
        "port": "5432"
    }
    
    # Ensure document_id is a string
    document_id = str(document_id)

    # Upsert query for each item
    upsert_query = """
    INSERT INTO public.groceries (user_id, item, quantity, category, purchase_date, expiry_date)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (item, purchase_date)
    DO UPDATE SET
        user_id = EXCLUDED.user_id,
        quantity = EXCLUDED.quantity,
        expiry_date = EXCLUDED.expiry_date;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Upsert each item
        for item in items:
            cursor.execute(upsert_query, (
                document_id,
                item['item'],
                item['quantity'],
                item['category'],
                item['purchase_date'],
                item['expiry_date']
            ))
        
        # Commit the transaction
        conn.commit()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return str(document_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

# Example usage
document_id = "1"
items = [
    {"item": "apple", "quantity": 50000, "category": "fruit", "purchase_date": "2024-06-03", "expiry_date": "2024-06-11"}
]

result = upsert_data_with_single_id(document_id, items)
print(result)