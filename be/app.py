from flask import Flask, request, jsonify
from scripts.post_grocery_data import upsert_data_with_single_id
from scripts.get_grocery_data import get_grocery_data_by_user_id

app = Flask(__name__)

@app.route('/grocery', methods=['POST'])
def add_grocery():
    data = request.get_json()
    document_id = data.get('user_id')
    items = data.get('items')
    if not document_id or not items:
        return {"error": "user_id and items are required"}, 400
    return upsert_data_with_single_id(document_id, items)

@app.route('/grocery/<user_id>', methods=['GET'])
def get_grocery(user_id):
    return jsonify(get_grocery_data_by_user_id(user_id))

if __name__ == '__main__':
    app.run(debug=True)
