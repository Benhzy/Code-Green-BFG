import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {  Menu, MenuButton, MenuList, MenuItem, Button, Stack, Input, InputGroup, InputRightElement, IconButton} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import InventoryItem from './components/InventoryItem';
import BottomMenuBar from './components/BottomMenuBar';
import RecipeList from './components/RecipeList';
import CameraComponent from './components/Camera';
import './App.css';
import EditItemForm from './components/EditItemForm'; 





const Groceries = ({ inventoryItems, onDecrement, onDelete, handleFilterChange, handleSearchChange, searchQuery, fetchInventoryItems, handleSortChange, sortCriterion }) => (
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
                <SortButton handleSortChange={handleSortChange} sortCriterion={sortCriterion} />
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
                    purchase_date={item.purchase_date}
                    expiry_date={item.expiry_date}
                    onDecrement={onDecrement}
                    onDelete={() => onDelete(item.item, item.purchase_date, item.expiry_date)}
                    fetchInventoryItems={fetchInventoryItems} // Pass fetchInventoryItems prop
                />
            ))}
        </div>
    </>
);

const SortButton = ({ handleSortChange, sortCriterion }) => (
    <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Sort By: {sortCriterion.charAt(0).toUpperCase() + sortCriterion.slice(1).replace('_', ' ')}
        </MenuButton>
        <MenuList>
            <MenuItem onClick={() => handleSortChange('alphabetical')}>Alphabetical</MenuItem>
            <MenuItem onClick={() => handleSortChange('quantity')}>Quantity</MenuItem>
            <MenuItem onClick={() => handleSortChange('purchase_date')}>Purchase Date</MenuItem>
            <MenuItem onClick={() => handleSortChange('expiry_date')}>Expiry Date</MenuItem>
        </MenuList>
    </Menu>
);


const AddItem = () => (
    <div>
        <h2>Add a new item</h2>
    </div>
);

function App() {
    const [filter, setFilter] = useState('All');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortCriterion, setSortCriterion] = useState('alphabetical');
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

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        console.log("Search initiated with query:", value);
    };

    const handleSortChange = (criterion) => {
        setSortCriterion(criterion);
    };

    const sortedItems = [...inventoryItems].sort((a, b) => {
        if (sortCriterion === 'alphabetical') {
            return a.item.localeCompare(b.item);
        } else if (sortCriterion === 'quantity') {
            return parseInt(a.quantity) - parseInt(b.quantity);
        } else if (sortCriterion === 'purchase_date') {
            return new Date(a.purchase_date) - new Date(b.purchase_date);
        } else if (sortCriterion === 'expiry_date') {
            return new Date(a.expiry_date) - new Date(b.expiry_date);
        }
        return 0;
    });
    
    const filteredSortedItems = sortedItems.filter(item => {
        return (filter === 'All' || item.category === filter) &&
               (searchQuery === '' || item.item.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
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

    return (
        <Router>
            <div className="main-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/groceries" />} />
                        <Route path="/recipes" element={<RecipeList userId={userId} />} />
                        <Route path="/groceries" element={<Groceries 
                                                            inventoryItems={filteredSortedItems} 
                                                            onDecrement={onDecrement} 
                                                            onDelete={onDelete} 
                                                            filter={filter} 
                                                            handleFilterChange={handleFilterChange} 
                                                            handleSearchChange={handleSearchChange} 
                                                            fetchInventoryItems={fetchInventoryItems}
                                                            handleSortChange={handleSortChange} 
                                                            sortCriterion={sortCriterion} 
                                                            />} />
                        <Route path="/add" element={<AddItem />} />
                        <Route path="/scanner" element={<CameraComponent userId={userId} />} />
                        <Route path="/edit-item" element={<EditItemForm fetchInventoryItems={fetchInventoryItems} />} /> {/* Add EditItemForm route */}
                    </Routes>
                </div>
                <BottomMenuBar fetchInventoryItems={fetchInventoryItems} />
            </div>
        </Router>
    );
}

export default App;
