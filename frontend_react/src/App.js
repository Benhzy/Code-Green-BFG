import React, { useState, useEffect } from 'react';
import InventoryItem from './components/InventoryItem';
import './App.css';

function App() {
    const [filter, setFilter] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const userId = 1; // Replace with the actual user ID

    // Fetch inventory items from an API
    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await fetch(`http://localhost:5000/grocery/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setInventoryItems(data);
                } else {
                    throw new Error('Failed to fetch items');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchInventoryItems();
    }, [userId]); // Dependency array now includes userId

    const handleFilterChange = (category) => {
        setFilter(category);
    };

    const onDecrement = (id, amount) => {
        setInventoryItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, quantity: Math.max(item.quantity - amount, 0) } : item
            )
        );
    };

    const onDelete = (id) => {
        setInventoryItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const filteredItems = inventoryItems.filter(item => {
        return filter === 'All' || item.category === filter;
    });

    return (
        <div className="main-container">
            <div className="filter-bar">
                <button onClick={() => handleFilterChange('All')}>🛒 All 🛒</button>
                <button onClick={() => handleFilterChange('Vegetables')}>🍅 Vegetables 🍅</button>
                <button onClick={() => handleFilterChange('Meat')}>🍖 Meat 🍖</button>
                <button onClick={() => handleFilterChange('Dairy')}>🥛 Dairy 🥛</button>
                <button onClick={() => handleFilterChange('Fruits')}>🍎 Fruits 🍎</button>
                <button onClick={() => handleFilterChange('Breads')}>🍞 Breads 🍞</button>
            </div>
            {filteredItems.map(item => (
                <InventoryItem
                    key={item.id}
                    {...item}
                    onDecrement={onDecrement}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default App;