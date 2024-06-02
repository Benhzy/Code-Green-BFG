# scripts/recipe_recommender.py

from get_grocery_data import get_grocery_data_by_user_id
from get_user_recipes import get_user_recipes_by_user_id

def analyze_user_data(user_id):
    # Fetch data from the database
    data, status_code = get_grocery_data_by_user_id(user_id)
    
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
    data, status_code = get_user_recipes_by_user_id(user_id)
    
    if status_code != 200:
        print(f"Error fetching data: {data['error']}")
        return
    
    # Create a list of tuples with (recipe_name, description)
    recipes_list = [(recipe['recipe_name'], recipe['description']) for recipe in data]
    
    return recipes_list

# Example usage (FEEL FREE TO COMMENT OR DELETE THIS PART OUT WHEN YOUARE DONE)
if __name__ == '__main__':
    user_id = "1"  # Replace with the user_id you want to analyze
    result = analyze_user_data(user_id)
    res2 = analyze_user_recipes(user_id)    
    print(result)
    print(res2)

# variables for getting user_data (items) and user_recipes (FEEL FREE TO CHANGE THE VARIABLE NAMES TO YOUR LIKING)
user_recipes = analyze_user_recipes
user_data = analyze_user_data


# INSERT RECIPE RECOMMENDER CODE HERE 

