from flask import Flask, request, jsonify
from flask_cors import CORS
from scripts.db_connection import get_user_recipes_by_user_id
from scripts.db_connection import upsert_user_groceries
from scripts.db_connection import get_grocery_data_by_user_id
from scripts.db_connection import upsert_user_recipes
from scripts.db_connection import delete_user_grocery

from scripts.recipe_recommender import recommend_recipes

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

@app.route('/delete_grocery', methods=['DELETE'])
def delete_grocery():
    data = request.get_json()
    user_id = data.get('user_id')
    item = data.get('item')
    expiry_date = data.get('expiry_date')
    purchase_date = data.get('purchase_date')
    
    if not user_id or not item or not expiry_date or not purchase_date:
        return jsonify({"error": "user_id, item, expiry_date, and purchase_date are required"}), 400
    
    result, status_code = delete_user_grocery(user_id, item, expiry_date, purchase_date)
    
    if status_code != 200:
        return jsonify(result), status_code
    
    return jsonify({"message": "Item deleted successfully"}), 200

@app.route('/recommend_recipe/<user_id>', methods=['GET'])
def recommend_recipe(user_id):
    # Assuming the cuisine type can also be passed as a query parameter
    cuisine = request.args.get('cuisine', 'Singaporean')
    try:
        return recommend_recipes(user_id, cuisine)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
