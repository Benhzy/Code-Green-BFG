import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import InventoryItem from './components/InventoryItem';
import Clock from './components/Clock';
import Sidebar from './components/Sidebar';
import RecipeList from './components/RecipeList';
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
    }, [userId]);

    const handleFilterChange = (category) => {
        setFilter(category);
    };

    const updateServer = async (updatedItems) => {
        try {
            const response = await fetch('http://localhost:5000/add_grocery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    items: updatedItems,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update items on the server');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onDecrement = (id, amount) => {
        const updatedItems = inventoryItems.map(item =>
            item.item === id ? { ...item, quantity: Math.max(item.quantity - amount, 0) } : item
        );
        setInventoryItems(updatedItems);
        updateServer(updatedItems);
    };

    const onDelete = async (id, purchase_date, expiry_date) => {
        try {
            const response = await fetch(`http://localhost:5000/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    item: id,
                    purchase_date: purchase_date,
                    expiry_date: expiry_date
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete item from the server');
            }

            const updatedItems = inventoryItems.filter(item => !(item.item === id && item.purchase_date === purchase_date && item.expiry_date === expiry_date));
            setInventoryItems(updatedItems);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredItems = inventoryItems.filter(item => {
        return filter === 'All' || item.category === filter;
    });

    return (
        <Router>
            <div className="main-container">
                <Sidebar /> 
                <div className="content">
                    <Routes>
                        <Route path="/recipes" element={<RecipeList userId={1} />} />
                    </Routes>
                    <Clock />
                    <div className="filter-bar">
                    <button onClick={() => handleFilterChange('All')}>🛒 All 🛒</button>
                    <button onClick={() => handleFilterChange('vegetable')}>🍅 Vegetables 🍅</button>
                    <button onClick={() => handleFilterChange('meat')}>🍖 Meat 🍖</button>
                    <button onClick={() => handleFilterChange('dairy')}>🥛 Dairy 🥛</button>
                    <button onClick={() => handleFilterChange('fruit')}>🍎 Fruits 🍎</button>
                    <button onClick={() => handleFilterChange('bread')}>🍞 Breads 🍞</button>
                    </div>
                    <div className="inventory-grid">
                        {filteredItems.map(item => (
                            <InventoryItem
                                key={item.item + item.purchase_date}
                                id={item.item}
                                item={item.item}
                                category={item.category}
                                quantity={item.quantity}
                                purchase_date={item.purchase_date}
                                expiry_date={item.expiry_date}
                                onDecrement={onDecrement}
                                onDelete={() => onDelete(item.item, item.purchase_date, item.expiry_date)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
