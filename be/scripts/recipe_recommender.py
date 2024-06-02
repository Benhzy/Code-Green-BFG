# analysis/analyze_grocery_data.py

from get_grocery_data import get_grocery_data_by_user_id

def analyze_data(user_id):
    # Fetch data from the database
    data, status_code = get_grocery_data_by_user_id(user_id)
    
    if status_code != 200:
        print(f"Error fetching data: {data['error']}")
        return
    
    # Create the dictionary with dates as keys and list of (item, quantity) tuples as values
    date_dict = {}
    for item in data:
        purchase_date = item['purchase_date']
        item_tuple = (item['item'], item['quantity'])
        if purchase_date not in date_dict:
            date_dict[purchase_date] = []
        date_dict[purchase_date].append(item_tuple)
    
    # Sort the dictionary by date keys
    sorted_date_dict = {k: date_dict[k] for k in sorted(date_dict)}
    
    return sorted_date_dict

# Example usage
if __name__ == '__main__':
    user_id = "2"  # Replace with the user_id you want to analyze
    result = analyze_data(user_id)
    print(result)

# INSERT RECIPE RECOMMENDER CODE HERE
