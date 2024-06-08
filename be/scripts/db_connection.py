import os
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_user_recipes_by_user_id(user_id):
    
    user_id = str(user_id)
    select_query = """
    SELECT user_id, recipe_name, ingredients, instructions, difficulty, time_required, description
    FROM public.user_recipes
    WHERE user_id = %s;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(select_query, (user_id,))
        recipes = cursor.fetchall()
        cursor.close()
        conn.close()
        return recipes
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def get_grocery_data_by_user_id(user_id):
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT")
    }
    
    user_id = str(user_id)
    select_query = """
    SELECT user_id, item, quantity, category, purchase_date, expiry_date
    FROM public.groceries
    WHERE user_id = %s;
    """

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(select_query, (user_id,))
        groceries = cursor.fetchall()
        cursor.close()
        conn.close()
        return groceries
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def upsert_user_recipes(user_id, recipes):
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT")
    }
    
    user_id = str(user_id)
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
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
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
        conn.commit()
        cursor.close()
        conn.close()
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def upsert_user_groceries(user_id, items):
    conn_params = {
        "dbname": os.getenv("DB_DEFAULT"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT")
    }
    
    user_id = str(user_id)
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
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        for item in items:
            cursor.execute(upsert_query, (
                user_id,
                item['item'],
                item['quantity'],
                item['category'],
                item['purchase_date'],
                item['expiry_date']
            ))
        conn.commit()
        cursor.close()
        conn.close()
        return str(user_id), 201
    except Exception as e:
        return {"error": f"An error occurred: {e}"}, 500

def delete_user_grocery(user_id, item, expiry_date, purchase_date):
    try:
        conn_params = {
            "dbname": os.getenv("DB_DEFAULT"),
            "user": os.getenv("DB_USER"),
            "password": os.getenv("DB_PASSWORD"),
            "host": os.getenv("DB_HOST"),
            "port": os.getenv("DB_PORT")
        }
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute(
            sql.SQL("DELETE FROM public.groceries WHERE user_id = %s AND item = %s AND expiry_date = %s AND purchase_date = %s"),
            [user_id, item, expiry_date, purchase_date]
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Item deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
