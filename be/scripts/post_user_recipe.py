# scripts/post_user_recipes.py

import psycopg2
from psycopg2 import sql

def upsert_user_recipes(user_id, recipes):
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

# # Example usage: 
# res, status_code = upsert_user_recipes("1", [
#     {
#         "recipe_name": "Apple Pie", 
#         "ingredients": "5 apples, 100g sugar, 200g flour, 50g butter", 
#         "instructions": "Mix and bake at 350 degrees for 45 minutes",
#         "difficulty": "Easy",
#         "time_required": "1 hour",
#         "description": "A classic apple pie recipe"
#     },
#     {
#         "recipe_name": "Banana Bread", 
#         "ingredients": "2 bananas, 50g sugar, 100g flour, 50g butter, 5 eggs", 
#         "instructions": "Mix and bake at 350 degrees for 60 minutes",
#         "difficulty": "Medium",
#         "time_required": "1.5 hours",
#         "description": "A delicious banana bread recipe"
#     }
# ])
# print(res, status_code)
