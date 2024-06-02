# scripts/get_user_recipes.py

import psycopg2
from psycopg2.extras import RealDictCursor

def get_user_recipes_by_user_id(user_id):
    # Database connection parameters
    conn_params = {
        "dbname": "postgres",
        "user": "postgres",
        "password": "00edward00",
        "host": "localhost",
        "port": "5432"
    }
    
    # Ensure user_id is a string
    user_id = str(user_id)

    # Query to fetch user recipes
    select_query = """
    SELECT recipe_name, description
    FROM public.user_recipes
    WHERE user_id = %s;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Execute the query
        cursor.execute(select_query, (user_id,))
        recipes = cursor.fetchall()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return recipes, 200
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500
