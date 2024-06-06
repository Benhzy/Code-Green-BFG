// components/InventoryItem.js
import React from 'react';

const InventoryItem = ({ id, item, category, quantity, purchase_date, expiry_date, onDecrement, onDelete }) => {
    return (
        <div className="inventory-item">
            <h3>{item}</h3>
            <p>Category: {category}</p>
            <p>Quantity: {quantity}</p>
            <p>Purchase Date: {purchase_date}</p>
            <p>Expiry Date: {expiry_date}</p>
            <button onClick={() => onDecrement(id, 1)}>Decrement</button>
            <button onClick={() => onDelete(id)}>Delete</button>
        </div>
    );
};

export default InventoryItem;
