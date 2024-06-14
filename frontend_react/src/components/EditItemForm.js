import React, { useState } from 'react';
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
  useToast
} from '@chakra-ui/react';
import { apiUrl } from './IpAdr';

const EditItemForm = ({ id, item: initialItem, category: initialCategory, quantity: initialQuantity, purchase_date: initialPurchaseDate, expiry_date: initialExpiryDate, onClose, fetchInventoryItems }) => {
    const [item, setItem] = useState(initialItem);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [category, setCategory] = useState(initialCategory);
    const [purchaseDate, setPurchaseDate] = useState(initialPurchaseDate);
    const [expiryDate, setExpiryDate] = useState(initialExpiryDate);

    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedItem = {
            user_id: 5,
            item,
            quantity,
            category,
            purchase_date: purchaseDate,
            expiry_date: expiryDate
        };

        try {
            await fetch(`${apiUrl}/delete_grocery`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: '5', item: id, purchase_date: initialPurchaseDate, expiry_date: initialExpiryDate }),
            });

            const response = await fetch(`${apiUrl}/add_grocery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([updatedItem]),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Item Updated Successfully",
                    description: JSON.stringify(result),
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
                fetchInventoryItems();
                onClose();
            } else {
                toast({
                    title: "Failed to Update Item",
                    description: result.error,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        } catch (error) {
            toast({
                title: "Error Updating Item",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
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
                    <Button colorScheme="orange" type="submit">Update Item</Button>
                </Flex>
            </form>
        </Box>
    );
};

export default EditItemForm;
