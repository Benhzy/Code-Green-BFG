import React, { useState } from 'react';
import './AddItemForm.css';
import { apiUrl } from './IpAdr'; 

const AddItemForm = ({ onClose, fetchInventoryItems }) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newItem = {
            user_id: 5, // Replace with actual user ID
            item,
            quantity,
            category,
            purchase_date: purchaseDate,
            expiry_date: expiryDate
        };
        
        try {
            const response = await fetch(`${apiUrl}/add_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([newItem]), // Send data as an array
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Item added successfully:", result);
                fetchInventoryItems(); // Fetch updated inventory items
                onClose(); // Close the form after successful submission
            } else {
                console.error("Failed to add item:", result.error);
                alert("Failed to add item: " + result.error);
            }
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Error adding item: " + error.message);
        }
    };

    return (
        <div className="add-item-form-container">
            <form className="add-item-form" onSubmit={handleSubmit}>
                <h2>Add New Item</h2>
                <label>
                    Item:
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Category:
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select category</option>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Meat">Meat</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Grain">Grain</option>
                        <option value="Seafood">Seafood</option>
                    </select>
                </label>
                <label>
                    Purchase Date:
                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Expiry Date:
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                    />
                </label>
                <div className="button-group">
                    <button type="submit" className="submit-button">Add Item</button>
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddItemForm;
