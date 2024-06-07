# scripts/get_user_recipes.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
load_dotenv()

# class DB_Connector:
#     # def __init__(self, user_id):
#     #     load_dotenv()
#     #     self.user = os.getenv("DB_USER")
#     #     self.password = os.getenv("DB_PASSWORD")
#     #     self.host = os.getenv("DB_HOST")
#     #     self.port = os.getenv("DB_PORT")
#     #     self.conn = psycopg2.connect(dbname=os.getenv("DB_DEFAULT"), user=self.user, password=self.password, host=self.host, port=self.port)
#     #     self.user_id = str(user_id)

        
def get_user_recipes_by_user_id(user_id):
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"), 
        "port": os.getenv("DB_PORT")
    }
    
    user_id = str(user_id)
    select_query = """
    SELECT user_id, recipe_name, ingredients, instructions, difficulty, time_required, description
    FROM public.user_recipes
    WHERE user_id = %s;
    """

    try:
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(select_query, (user_id,))
        recipes = cursor.fetchall()
        cursor.close()
        conn.close()
        return recipes
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def get_grocery_data_by_user_id(user_id):
    # Database connection parameters
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),  
        "port": os.getenv("DB_PORT")
    }
    
    # Ensure user_id is a string
    user_id = str(user_id)

    # Query to retrieve grocery data
    select_query = """
    SELECT user_id, item, quantity, category, purchase_date, expiry_date
    FROM public.groceries
    WHERE user_id = %s;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Execute the query
        cursor.execute(select_query, (user_id,))
        
        # Fetch all results
        groceries = cursor.fetchall()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return groceries
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def upsert_user_recipes(user_id, recipes):
    # Database connection parameters
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT")
    }
    
    # Ensure user_id is a string
    user_id = str(user_id)

    # Upsert query for each recipe
    upsert_query = """
    INSERT INTO public.user_recipes (user_id, recipe_name, ingredients, instructions, difficulty, time_required, description)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id, recipe_name)
    DO UPDATE SET
        ingredients = EXCLUDED.ingredients,
        instructions = EXCLUDED.instructions,
        difficulty = EXCLUDED.difficulty,
        time_required = EXCLUDED.time_required,
        description = EXCLUDED.description;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Upsert each recipe
        for recipe in recipes:
            cursor.execute(upsert_query, (
                user_id,
                recipe['recipe_name'],
                recipe['ingredients'],
                recipe['instructions'],
                recipe['difficulty'],
                recipe['time_required'],
                recipe['description']
            ))
        
        # Commit the transaction
        conn.commit()
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500


def upsert_user_groceries(user_id, items):
    # Database connection parameters
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),  
        "port": os.getenv("DB_PORT")
    }
    
    # Ensure user_id is a string
    user_id = str(user_id)

    # Upsert query for each item
    upsert_query = """
    INSERT INTO public.groceries (user_id, item, quantity, category, purchase_date, expiry_date)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (user_id, item, purchase_date)
    DO UPDATE SET
        quantity = EXCLUDED.quantity,
        category = EXCLUDED.category,
        expiry_date = EXCLUDED.expiry_date;
    """

    try:
        # Establish a database connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Upsert each item
        for item in items:
            cursor.execute(upsert_query, (
                user_id,
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
        
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500