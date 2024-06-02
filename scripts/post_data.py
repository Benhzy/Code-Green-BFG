import psycopg2

def upsert_data_with_single_id(document_id, items, preferred_recipes):
    # Database connection parameters
    conn_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "00edward00",
        "host": "localhost",
        "port": "5432"
    }
    
    # Ensure document_id is an integer
    try:
        document_id = int(document_id)
    except ValueError:
        return {"error": "Invalid integer ID"}, 400
    
    # Convert lists to strings for storage in PostgreSQL
    items_str = ','.join(items)
    preferred_recipes_str = ','.join(preferred_recipes)

    # upsert_query here
    upsert_query = """
    INSERT INTO public.users (user_id, items, recipes)
    VALUES (%s, %s, %s)
    ON CONFLICT (user_id)
    DO UPDATE SET
        items = EXCLUDED.items,
        recipes = EXCLUDED.recipes;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Upsert the data
        cursor.execute(upsert_query, (document_id, items_str, preferred_recipes_str))
        
        # Commit the transaction
        conn.commit()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return str(document_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

# Example usage
document_id = 1
items = ["apple", "banana", "orange"]
preferred_recipes = ["fruit salad", "smoothie"]

result = upsert_data_with_single_id(document_id, items, preferred_recipes)
print(result)
