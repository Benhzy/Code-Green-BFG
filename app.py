from flask import Flask, jsonify, request
import scripts.recipe_recommender as recipe_recommender_module
import scripts.inventory as inventory_module
import scripts.post_data as post_data_module
import scripts.get_data as get_data_module

app = Flask(__name__)

db_url = 'mongodb+srv://edwardsim2021:RCktN9Ue3fbBkfs1@pantry-inventory.1nbxovo.mongodb.net/'
db_name = 'inventories'
collection_name = 'groceries'

items = {
    "apples": 3, 
    "bananas": 3
}
preferred_recipes = {
    "Apple Pie": ["5 apples", "200g flour", "100g sugar"], 
    "Banana Bread": ["3 bananas", "200g flour", "100g sugar"]
}

@app.route('/recipe_recommender', methods=['GET'])
def script1():
    res = recipe_recommender_module.main()
    return res

@app.route('/current_inventory', methods=['GET'])
def script2(): 
    res = inventory_module.current_inventory()
    return res

@app.route('/add_inventory/<string:document_id>', methods=['POST'])
def add_inventory(document_id):
    inserted_id, status_code = post_data_module.upsert_data_with_single_id(
        db_url, db_name, collection_name, document_id, items, preferred_recipes)
    if status_code == 201:
        return jsonify({"inserted_id": inserted_id}), 201
    else:
        return jsonify(inserted_id), status_code

@app.route('/get_inventory/<string:document_id>', methods=['GET'])
def get_inventory(document_id):
    document, status_code = get_data_module.get_data_by_int_id(document_id)
    return jsonify(document), status_code

if __name__ == '__main__':
    app.run(debug=True)
