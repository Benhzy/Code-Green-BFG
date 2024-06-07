from flask import Flask, request, jsonify
from flask_cors import CORS
from scripts.db_connection import get_user_recipes_by_user_id
from scripts.db_connection import upsert_user_groceries
from scripts.db_connection import get_grocery_data_by_user_id
from scripts.db_connection import upsert_user_recipes

app = Flask(__name__)
CORS(app)

@app.route('/add_grocery', methods=['POST'])
def add_grocery():
    data = request.get_json()
    user_id = data.get('user_id')
    items = data.get('items')
    
    if not user_id or not items:
        return jsonify({"error": "user_id and items are required"}), 400
    
    result, status_code = upsert_user_groceries(user_id, items)
    
    if status_code != 201:
        return jsonify(result), status_code
    
    return jsonify({"message": "Data posted successfully", "user_id": result}), 201

@app.route('/grocery/<user_id>', methods=['GET'])
def get_grocery(user_id):
    return jsonify(get_grocery_data_by_user_id(user_id))

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    data = request.get_json()
    user_id = data.get('user_id')
    recipes = data.get('recipes')
    
    if not user_id or not recipes:
        return jsonify({"error": "user_id and recipes are required"}), 400
    
    # Convert ingredients list to a comma-separated string for each recipe
    for recipe in recipes:
        if isinstance(recipe['ingredients'], list):
            recipe['ingredients'] = ', '.join(recipe['ingredients'])
    
    result, status_code = upsert_user_recipes(user_id, recipes)
    
    if status_code != 201:
        return jsonify(result), status_code
    else:
        return jsonify({"message": "Data posted successfully", "user_id": result}), 201

@app.route('/recipe/<user_id>', methods=['GET'])
def get_recipe(user_id):
    return jsonify(get_user_recipes_by_user_id(user_id))

if __name__ == '__main__':
    app.run(debug=True)
