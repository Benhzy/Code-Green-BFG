import React, { useState } from 'react';
import './AddItemForm.css';
import { apiUrl } from './IpAdr'; 
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    Flex,
    Box,
  } from '@chakra-ui/react';

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
        <Box className="add-item-form-container" p={4} boxShadow="md" rounded="md" bg="white">
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Item</FormLabel>
                    <Input type="text" value={item} onChange={(e) => setItem(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <NumberInput min={0} value={quantity} onChange={valueString => setQuantity(valueString)}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Vegetable">Vegetable</option>
                        <option value="Meat">Meat</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Grain">Grain</option>
                        <option value="Seafood">Seafood</option>
                    </Select>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Purchase Date</FormLabel>
                    <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </FormControl>
                <Flex mt={4} justifyContent="space-between">
                    <Button colorScheme="blue" onClick={onClose}>Cancel</Button>
                    <Button colorScheme="teal" type="submit">Add Item</Button>
                </Flex>
            </form>
        </Box>
    );
};

export default AddItemForm;
