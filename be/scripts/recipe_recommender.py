# scripts/recipe_recommender.py
import os
from openai import OpenAI
from datetime import datetime, timedelta
from db_connection import DB_Connector

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def analyze_user_data(user_id):
    # Fetch data from the database
    dbconn  = DB_Connector(user_id)
    data, status_code = dbconn.get_grocery_data_by_user_id()
    
    if status_code != 200:
        print(f"Error fetching data: {data['error']}")
        return
    
    # Create the dictionary with dates as keys and list of (item, quantity) tuples as values
    date_dict = {}
    for item in data:
        expiry_date = item['expiry_date']
        item_tuple = (item['item'], item['quantity'])
        if expiry_date not in date_dict:
            date_dict[expiry_date] = []
        date_dict[expiry_date].append(item_tuple)
    
    # Sort the dictionary by date keys
    sorted_date_dict = {k: date_dict[k] for k in sorted(date_dict)}
    
    return sorted_date_dict

def analyze_user_recipes(user_id):
    # Fetch user recipes from the database
    dbconn  = DB_Connector(user_id)
    data, status_code = dbconn.get_user_recipes_by_user_id()
    
    if status_code != 200:
        print(f"Error fetching data: {data['error']}")
        return
    
    # Create a list of tuples with (recipe_name, description)
    recipes_list = [(recipe['recipe_name'], recipe['description']) for recipe in data]
    
    return recipes_list

# # variables for getting user_data (items) and user_recipes (FEEL FREE TO CHANGE THE VARIABLE NAMES TO YOUR LIKING)
# user_recipes = analyze_user_recipes
# user_data = analyze_user_data


# INSERT RECIPE RECOMMENDER CODE HERE 


def fetch_ingredients_near_expiry(user_id):
    # Assuming the function `analyze_data` returns a dictionary sorted by purchase dates.
    groceries = analyze_user_data(user_id)
    near_expiry_ingredients = []

    # Check for items within 3 days of expiry
    cutoff_date = datetime.now() + timedelta(days=3)
    for date_str, items in groceries.items():
        if datetime.strptime(date_str, "%Y-%m-%d") <= cutoff_date:
            near_expiry_ingredients.extend(items)
    
    return near_expiry_ingredients

def generate_recipe_suggestions(ingredients, user_recipes):
    # Prepare the prompt for GPT based on near expiry ingredients and user's recipes
    ingredients_list = ', '.join([item[0] for item in ingredients])
    recipes_list = ', '.join([recipe[0] for recipe in user_recipes])

    extra_prompt = ""
    if recipes_list != []:
        extra_prompt = f"Base your recipe on these recipes: {recipes_list}"

    prompt = f"""
    Create a recipe using the following ingredients close to expiry: {ingredients_list}.

    Give your output in the following format!

    Recipe Name: The name of the dish.
    Description: A short description of the dish.
    Detailed Steps: A list of steps involved in making the dish, each step described in string format and including specific details such as cooking time, temperature, and techniques.
    Ingredients: Each ingredient listed in a tuple format ('ingredient name', 'quantity'), with all quantities provided in the metric system.
    Time Required: Total time needed to prepare and cook the dish.
    Difficulty: Difficulty level of the recipe (e.g., Easy, Medium, Hard).
    
    Each step in the "Detailed Steps" should be a concise but comprehensive instruction, incorporating elements like exact cooking times, temperatures, and special techniques (e.g., 'Sauté onions over medium heat until translucent, about 5 minutes', 'Bake at 200°C for 30 minutes').
    
    \n{extra_prompt}
    
    """

    response = client.chat.completions.create(
        model='gpt-3.5-turbo-0125',
        messages=[
            {
            "role": "user",
            "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=15,
        top_p=0.2,
        frequency_penalty=0,
        presence_penalty=0
    )
    choices = response.choices[0]
    text = choices.message.content

    return text

def recommend_recipes(user_id):
    # Retrieve ingredients near their expiry date
    near_expiry_ingredients = fetch_ingredients_near_expiry(user_id)
    
    # Retrieve user's stored recipes
    user_recipes = analyze_user_recipes(user_id)
    
    # Generate recipe suggestions
    if near_expiry_ingredients:
        return generate_recipe_suggestions(near_expiry_ingredients, user_recipes)
    else:
        return "No ingredients are close to expiry, or no ingredients data available."

