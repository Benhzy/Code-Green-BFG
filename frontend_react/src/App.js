import React, { useState, useEffect } from 'react';
import { Button, Stack, Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import InventoryItem from './components/InventoryItem';
import BottomMenuBar from './components/BottomMenuBar';
import RecipeList from './components/RecipeList';
import './App.css';

const Groceries = ({ inventoryItems, onDecrement, onDelete, handleFilterChange, handleSearchChange, searchQuery }) => (
    <>
        <div className="search-container">
            <InputGroup>
                <Input 
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <InputRightElement>
                    <IconButton
                        aria-label="Search database"
                        icon={<SearchIcon />}
                        onClick={handleSearchChange}
                    />
                </InputRightElement>
            </InputGroup>
        </div>
        <div className="filter-container">
            <Stack direction="row" spacing={4}>
                <Button colorScheme="gray" variant="solid" onClick={() => handleFilterChange('All')}>All</Button>
                <Button colorScheme="gray" variant="solid" onClick={() => handleFilterChange('Vegetables')}>🍅 Vegetables</Button>
                <Button colorScheme="gray" variant="solid" onClick={() => handleFilterChange('Meat')}>🍖 Meat</Button>
                <Button colorScheme="gray" variant="solid" onClick={() => handleFilterChange('Dairy')}>🥛 Dairy</Button>
                <Button colorScheme="gray" variant="solid" onClick={() => handleFilterChange('Fruits')}>🍎 Fruits</Button>
                <Button colorScheme="gray" variant="solid" onClick={() => handleFilterChange('Breads')}>🍞 Breads</Button>
            </Stack>
        </div>
        <div className="inventory-grid">
            {inventoryItems.map(item => (
                <InventoryItem
                    key={item.item + item.purchase_date}
                    id={item.item}
                    item={item.item}
                    category={item.category}
                    quantity={item.quantity}
                    purchaseCar_date={item.purchase_date}
                    expiry_date={item.expiry_date}
                    onDecrement={onDecrement}
                    onDelete={() => onDelete(item.item, item.purchase_date, item.expiry_date)}
                />
            ))}
        </div>
    </>
);


const AddItem = () => (
    <div>
        <h2>Add a new item</h2>
    </div>
);

function App() {
    const [filter, setFilter] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const userId = 5; // Replace with the actual user ID

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch(`http://localhost:5000/grocery/${userId}`);
            const data = await response.json();
            if (response.ok) {
                console.log("Fetched inventory items:", data); // Debugging statement
                setInventoryItems(data);
            } else {
                throw new Error('Failed to fetch items');
            }
        } catch (error) {
            console.error('Error fetching inventory items:', error);
        }
    };

    useEffect(() => {
        fetchInventoryItems();
    }, [userId]);

    const handleFilterChange = (category) => {
        setFilter(category);
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        // to be implemented
        console.log("Search initiated with query:", value);
    };

    const updateServer = async (updatedItem) => {
        try {
            console.log('Updating server with item:', updatedItem); // Debugging statement
            const response = await fetch('http://localhost:5000/add_grocery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update items on the server: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Server response after update:', data); // Debugging statement
        } catch (error) {
            console.error('Error updating server:', error);
        }
    };

    const deleteItemFromServer = async (itemToDelete) => {
        try {
            console.log('Deleting item from server:', itemToDelete); // Debugging statement
            const response = await fetch('http://localhost:5000/delete_grocery', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId.toString(),
                    item: itemToDelete.item,
                    purchase_date: itemToDelete.purchase_date,
                    expiry_date: itemToDelete.expiry_date
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete item from the server: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Server response after delete:', data); // Debugging statement
        } catch (error) {
            console.error('Error deleting item from server:', error);
        }
    };

    const onDecrement = (id, amount) => {
        const updatedItems = inventoryItems.map(item =>
            item.item === id ? { ...item, quantity: Math.max(parseInt(item.quantity) - amount, 0).toString() } : item
        );

        const updatedItem = updatedItems.find(item => item.item === id);

        if (updatedItem.quantity === "0") {
            // If quantity is 0, delete the item
            deleteItemFromServer(updatedItem);
            const filteredItems = updatedItems.filter(item => item.item !== id);
            setInventoryItems(filteredItems);
        } else {
            // Otherwise, update the item on the server
            const payload = [
                {
                    user_id: userId.toString(),
                    item: updatedItem.item,
                    quantity: updatedItem.quantity,
                    category: updatedItem.category,
                    purchase_date: updatedItem.purchase_date,
                    expiry_date: updatedItem.expiry_date
                }
            ];

            console.log('Payload to send:', payload); // Debugging statement

            setInventoryItems(updatedItems);
            updateServer(payload);
        }
    };

    const onDelete = async (id, purchase_date, expiry_date) => {
        try {
            const payload = {
                user_id: userId.toString(),
                item: id,
                purchase_date: purchase_date,
                expiry_date: expiry_date
            };

            console.log('Deleting item with payload:', payload); // Debugging statement

            const response = await fetch('http://localhost:5000/delete_grocery', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete item from the server: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Server response after delete:', data); // Debugging statement

            const updatedItems = inventoryItems.filter(item => !(item.item === id && item.purchase_date === purchase_date && item.expiry_date === expiry_date));
            console.log('Updated items after delete:', updatedItems); // Debugging statement
            setInventoryItems(updatedItems);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filteredItems = inventoryItems.filter(item => {
        return filter === 'All' || item.category === filter;
    });

    return (
        <Router>
            <div className="main-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/groceries" />} />
                        <Route path="/recipes" element={<RecipeList userId={userId} />} />
                        <Route path="/groceries" element={<Groceries inventoryItems={filteredItems} onDecrement={onDecrement} onDelete={onDelete} filter={filter} handleFilterChange={handleFilterChange} handleSearchChange={handleSearchChange} />} />
                        <Route path="/add" element={<AddItem />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </div>
                <BottomMenuBar fetchInventoryItems={fetchInventoryItems} />
            </div>
        </Router>
    );
}

export default App;
