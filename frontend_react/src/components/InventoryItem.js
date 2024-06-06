import React from 'react';
import { Button } from 'react-bootstrap'; // Ensure react-bootstrap is being used

const InventoryItem = ({ id, title, quantity, unit, purchaseDate, daysAgo, expiryDate, daysLeft, onDecrement, onDelete }) => {
    return (
        <div className="inventory-item">
            <div className="product-details">
                <div className="product-title">{title}</div>
                <div className="product-quantity-container">
                    {quantity} {unit}
                </div>
            </div>
            <div className="purchase-dates-container">
                <i className="bi bi-cart2"></i>
                <span>{purchaseDate}</span>
                <span>({daysAgo} days ago)</span>
            </div>
            <div className="expiry-dates-container">
                <i className="bi bi-calendar"></i>
                <span>{expiryDate}</span>
                <span>({daysLeft} days left)</span>
            </div>
            <div className="item-actions">
                <Button onClick={() => onDecrement(id, 1)} variant="success" className="use-item-btn" size="sm">Use 1 {unit}</Button>
                <Button onClick={() => onDelete(id)} variant="danger" className="delete-item-btn" size="sm">Delete</Button>
            </div>
        </div>
    );
};

export default InventoryItem;
