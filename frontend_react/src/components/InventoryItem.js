// components/InventoryItem.js
import React, { useState } from 'react';
import EditItemForm from './EditItemForm'; // Import the EditItemForm component

const InventoryItem = ({ id, item, category, quantity, purchase_date, expiry_date, onDecrement, onDelete, fetchInventoryItems }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCloseEditForm = () => {
        setIsEditing(false);
    };

    return (
        <div className="inventory-item">
            {!isEditing ? (
                <>
                    <h3>{item}</h3>
                    <p>Category: {category}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Purchase Date: {purchase_date}</p>
                    <p>Expiry Date: {expiry_date}</p>
                    <button onClick={() => onDecrement(id, 1)}>Decrement</button>
                    <button onClick={() => onDelete(id)}>Delete</button>
                    <button onClick={handleEdit}>Edit</button>
                </>
            ) : (
                <EditItemForm
                    id={id}
                    item={item}
                    category={category}
                    quantity={quantity}
                    purchase_date={purchase_date}
                    expiry_date={expiry_date}
                    onClose={handleCloseEditForm}
                    fetchInventoryItems={fetchInventoryItems}
                />
            )}
        </div>
    );
};

export default InventoryItem;
