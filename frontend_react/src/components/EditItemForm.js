import React, { useState } from 'react';
import './AddItemForm.css'; // Reuse the same CSS
import { apiUrl } from './IpAdr'; 

const EditItemForm = ({ id, item: initialItem, category: initialCategory, quantity: initialQuantity, purchase_date: initialPurchaseDate, 
    expiry_date: initialExpiryDate, onClose, fetchInventoryItems }) => {
    const [item, setItem] = useState(initialItem);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [category, setCategory] = useState(initialCategory);
    const [purchaseDate, setPurchaseDate] = useState(initialPurchaseDate);
    const [expiryDate, setExpiryDate] = useState(initialExpiryDate);

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedItem = {
            user_id: 5, // Replace with actual user ID
            item,
            quantity,
            category,
            purchase_date: purchaseDate,
            expiry_date: expiryDate
        };

        try {
            // Delete the old item
            await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: '5', item: id, purchase_date: initialPurchaseDate, expiry_date: initialExpiryDate }),
            });

            // Add the updated item
            const response = await fetch(`${apiUrl}/add_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([updatedItem]), // Send data as an array
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Item updated successfully:", result);
                fetchInventoryItems(); // Fetch updated inventory items
                onClose(); // Close the form after successful submission
            } else {
                console.error("Failed to update item:", result.error);
                alert("Failed to update item: " + result.error);
            }
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Error updating item: " + error.message);
        }
    };

    return (
        <div className="add-item-form-container">
            <form className="add-item-form" onSubmit={handleSubmit}>
                <h2>Edit Item</h2>
                <label>
                    Item:
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required />
                </label>
                <label>
                    Quantity:
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button type="button" onClick={decrementQuantity} className="quantity-modify">-</button>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required style={{ textAlign: 'center' }} />
                        <button type="button" onClick={incrementQuantity} className="quantity-modify">+</button>
                    </div>
                </label>
                <label>
                    Category:
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="" disabled>Select category</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Meat">Meat</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Breads">Breads</option>
                    </select>
                </label>
                <label>
                    Purchase Date:
                    <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
                </label>
                <label>
                    Expiry Date:
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                </label>
                <div className="button-group">
                    <button type="submit" className="submit-button">Update Item</button>
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditItemForm;