# scripts/get_user_recipes.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
load_dotenv()

class DB_Connector:
    def __init__(self, user_id):
        load_dotenv()
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        self.host = os.getenv("DB_HOST")
        self.port = os.getenv("DB_PORT")
        self.conn = psycopg2.connect(dbname=os.getenv("DB_DEFAULT"), user=self.user, password=self.password, host=self.host, port=self.port)
        self.user_id = str(user_id)
        
    def get_user_recipes_by_user_id(self):

        # Query to fetch user recipes
        select_query = """
        SELECT recipe_name, description
        FROM public.user_recipes
        WHERE user_id = %s;
        """

        try:
            cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            
            # Execute the query
            cursor.execute(select_query, (self.user_id,))
            recipes = cursor.fetchall()
            
            # Close the cursor and connection
            cursor.close()
            self.conn.close()
            
            return recipes, 200
        except Exception as e:
            return {"error": f"An error occurred: {e}"}, 500

    def get_grocery_data_by_user_id(self):
        # Query to retrieve grocery data
        select_query = """
        SELECT user_id, item, quantity, category, purchase_date, expiry_date
        FROM public.groceries
        WHERE user_id = %s;
        """

        try:
            cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            
            # Execute the query
            cursor.execute(select_query, (self.user_id,))
            
            # Fetch all results
            groceries = cursor.fetchall()
            
            # Close the cursor and connection
            cursor.close()
            self.conn.close()
            
            return groceries, 200
        except Exception as e:
            return {"error": f"An error occurred: {e}"}, 500