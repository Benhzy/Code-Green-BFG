# scripts/recipe_recommender.py
import os
from openai import OpenAI
from datetime import datetime, timedelta
from scripts.db_connection import get_grocery_data_by_user_id, get_user_recipes_by_user_id, upsert_user_recipes

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def analyze_user_data(user_id):
    # Fetch data from the database
    data = get_grocery_data_by_user_id(user_id)
    
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
    data = get_user_recipes_by_user_id(user_id)
    
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
        if datetime.strptime(str(date_str), "%Y-%m-%d") <= cutoff_date:
            near_expiry_ingredients.extend(items)
    
    return ",".join(near_expiry_ingredients)

def generate_recipe_suggestions(ingredients, user_recipes, cuisine = "Singaporean"):
    # Prepare the prompt for GPT based on near expiry ingredients and user's recipes
    ingredients_list = ', '.join([item[0] for item in ingredients])
    recipes_list = ', '.join([recipe[0] for recipe in user_recipes])

    extra_prompt = ""
    if recipes_list != []:
        extra_prompt = f"Base your recipe on the cuisines from these recipes if possible: {recipes_list}"

    prompt = f"""
    Create a {cuisine} food recipe using the following ingredients close to expiry: {ingredients_list}.

    Make sure the recipe is an authentic {cuisine} recipe.

    You do not need to use all the ingredients, if a ingredient does not being in the recipe, omit it.

    Give your output in the following format!

    Recipe Name: The name of the dish.
    Description: A short description of the dish.
    Ingredients: Each ingredient listed in a tuple format ('ingredient name', 'quantity'). IMPORTANT! all quantities need to be provided in the metric system! (e.g., - Chicken: 200g, - Olive Oil: 5ml).
    Detailed Steps: A list of steps involved in making the dish, each step described in string format and including specific details such as cooking time, temperature, and techniques.
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
        max_tokens=700,
        top_p=0.2,
        frequency_penalty=0,
        presence_penalty=0
    )
    choices = response.choices[0]
    text = choices.message.content

    return text

def extract_recipe(recipe_data):
    lines = recipe_data.strip().split('\n')

    recipe_dict = {}

    in_ingredients = False
    in_steps = False
    ingredients = []
    steps = []

    for line in lines:
        line = line.strip()
        if line.startswith('Recipe Name:'):
            recipe_dict['recipe_name'] = line.split(': ')[1].strip()
        elif line.startswith('Ingredients:'):
            in_ingredients = True
            in_steps = False
        elif line.startswith('Detailed Steps:'):
            in_ingredients = False
            in_steps = True
        elif line.startswith('Time Required:'):
            recipe_dict['time_required'] = line.split(': ')[1].strip()
        elif line.startswith('Difficulty:'):
            recipe_dict['difficulty'] = line.split(': ')[1].strip()
        elif in_ingredients and '-' in line:
            # Extract ingredient
            ingredient_data = line.split('-', 1)[1].strip()
            if ':' in ingredient_data:
                ingredient, quantity = ingredient_data.split(':', 1)
                ingredients.append(ingredient.strip())
            else:
                ingredients.append((ingredient_data, ''))  # In case there's no quantity specified
        elif in_steps and line and line[0].isdigit():
            # Extract steps 
            steps.append(line.split('.', 1)[1].strip())
    
    recipe_dict['ingredients'] = ingredients
    recipe_dict['instructions'] = steps
    
    return recipe_dict

def recommend_recipes(user_id, cuisine):
    # Retrieve ingredients near their expiry date
    near_expiry_ingredients = fetch_ingredients_near_expiry(user_id)

    # Retrieve user's stored recipes
    user_recipes = analyze_user_recipes(user_id)

    # Generate recipe suggestions
    if near_expiry_ingredients:
        raw_recipe = generate_recipe_suggestions(near_expiry_ingredients, user_recipes, cuisine)
        recipe = extract_recipe(raw_recipe)
        recipe['user_id'] = user_id
        upsert_user_recipes(user_id, [recipe])
    else:
        return "No ingredients are close to expiry."

# near_expiry_ingredients = "Chicken, Pork, Celery, Eggplant, Strawberries"
# user_recipes = []
# print(recommend_recipes(1, "Chinese"))