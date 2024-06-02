import psycopg2
from psycopg2 import sql

def get_data_by_int_id(document_id):
    # Database connection parameters
    conn_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "00edward00",
        "host": "localhost",
        "port": "5432"
    }
    
    try:
        # Ensure document_id is an integer
        document_id = int(document_id)
    except ValueError:
        return {"error": "Invalid integer ID"}, 400

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()

        # SQL query to fetch the document
        fetch_query = sql.SQL("SELECT * FROM public.users WHERE user_id = %s")
        
        # Execute the query
        cursor.execute(fetch_query, (document_id,))
        
        # Fetch the result
        result = cursor.fetchone()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()

        if result:
            # Assuming the table columns are id, items, and recipes
            document = {
                "user_id": result[0],
                "items": result[1],
                "recipes": result[2]
            }
            return document, 200
        else:
            return {"error": "Document not found"}, 404

    except psycopg2.Error as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while fetching the document"}, 500

# Example usage
document_id = 1
result = get_data_by_int_id(document_id)
print(result)
