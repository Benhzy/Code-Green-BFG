import React, { useState, useEffect } from 'react';
import InventoryItem from './components/InventoryItem';
import Clock from './components/Clock';
import { Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { Add as AddIcon, PhotoCamera as PhotoCameraIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import './App.css';

function App() {
    const [filter, setFilter] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isFabOpen, setFabOpen] = useState(false);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isUploadOpen, setUploadOpen] = useState(false);
    const [newItem, setNewItem] = useState({ item: '', quantity: '', category: '' });

    const userId = 1; // Replace with the actual user ID

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

    const onDelete = (id) => {
        const updatedItems = inventoryItems.filter(item => item.item !== id);
        setInventoryItems(updatedItems);
        updateServer(updatedItems);
    };

    const handleFabClick = () => {
        setFabOpen(!isFabOpen);
    };

    const handleFormOpen = () => {
        setFormOpen(true);
        setFabOpen(false);
    };

    const handleUploadOpen = () => {
        setUploadOpen(true);
        setFabOpen(false);
    };

    const handleFormClose = () => {
        setFormOpen(false);
    };

    const handleUploadClose = () => {
        setUploadOpen(false);
    };

    const handleNewItemChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleAddNewItem = () => {
        const updatedItems = [...inventoryItems, newItem];
        setInventoryItems(updatedItems);
        updateServer(updatedItems);
        setNewItem({ item: '', quantity: '', category: '' });
        handleFormClose();
    };

    const filteredItems = inventoryItems.filter(item => {
        return filter === 'All' || item.category === filter;
    });

    return (
        <div className="main-container">
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
                        key={item.item}
                        id={item.item}
                        item={item.item}
                        category={item.category}
                        quantity={item.quantity}
                        purchase_date={item.purchase_date}
                        expiry_date={item.expiry_date}
                        onDecrement={onDecrement}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Floating Action Button */}
            <Fab color="primary" aria-label="add" onClick={handleFabClick} style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <AddIcon />
            </Fab>

            {/* Expanded Buttons */}
            {isFabOpen && (
                <>
                    <Fab color="secondary" aria-label="add-grocery" onClick={handleFormOpen} style={{ position: 'fixed', bottom: 86, right: 16 }}>
                        <AddShoppingCartIcon />
                    </Fab>
                    <Fab color="secondary" aria-label="upload-photo" onClick={handleUploadOpen} style={{ position: 'fixed', bottom: 156, right: 16 }}>
                        <PhotoCameraIcon />
                    </Fab>
                </>
            )}

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onClose={handleFormClose}>
                <DialogTitle>Add Grocery</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Grocery Item"
                        type="text"
                        fullWidth
                        name="item"
                        value={newItem.item}
                        onChange={handleNewItemChange}
                    />
                    <TextField
                        margin="dense"
                        label="Quantity"
                        type="number"
                        fullWidth
                        name="quantity"
                        value={newItem.quantity}
                        onChange={handleNewItemChange}
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        type="text"
                        fullWidth
                        name="category"
                        value={newItem.category}
                        onChange={handleNewItemChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFormClose}>Cancel</Button>
                    <Button onClick={handleAddNewItem}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onClose={handleUploadClose}>
                <DialogTitle>Upload Photo</DialogTitle>
                <DialogContent>
                    <Button variant="contained" component="label">
                        Upload File
                        <input type="file" hidden />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadClose}>Cancel</Button>
                    <Button onClick={handleUploadClose}>Upload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;