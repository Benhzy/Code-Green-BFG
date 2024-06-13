import React, { useState } from 'react';
import { Button, Box, Text, Stack, Flex, Divider, } from '@chakra-ui/react';
import EditItemForm from './EditItemForm';

// Mapping categories to emojis
const categoryEmojis = {
    Fruit: "🍎",
    Vegetable: "🥦",
    Dairy: "🥛",
    Meat: "🍖",
    Grain: "🥐",
    Seafood: "🐟",
};

// Calculate days until expiry
const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const InventoryItem = ({ id, item, category, quantity, purchase_date, expiry_date, onDecrement, onDelete, fetchInventoryItems }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Determine box color based on expiry
    const daysUntilExpiry = calculateDaysUntilExpiry(expiry_date);
    const boxColor = daysUntilExpiry <= 0 ? "red.300" : daysUntilExpiry <= 5 ? "orange.300" : "green.300";

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCloseEditForm = () => {
        setIsEditing(false);
    };

    // Function to get emoji by category
    const getEmoji = (category) => {
        return categoryEmojis[category] || "❓";
    };

    // Decrement functions
    const handleDecrementBy5 = () => {
        // Implement the decrement logic or invoke a passed function
        onDecrement(id, 5);
    };

    const handleDecrementBy10 = () => {
        // Implement the decrement logic or invoke a passed function
        onDecrement(id, 10);
    };

    return (
        <Box
            className="inventory-item"
            p={0}
            borderWidth="4px"
            borderRadius="2xl"
            w="350px"
            h="340px"
            overflow="auto"
            borderColor="black"
            sx={{
                boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.5)" // Custom shadow casting to the right and bottom
            }}
            >
            <Box bg={boxColor}>
                {!isEditing ? (
                    <Flex align="center" justify="flex-start" spacing="4">
                        <Text fontSize="7xl">{getEmoji(category)}</Text>
                        <Flex align="center" justify="left">
                            <Text w="full">
                                <Text fontSize="2xl" fontWeight="bold" ml="2">{item}</Text>
                                <Divider my="1" borderColor="transparent"/>
                                <Text fontSize="lg">
                                    <Text as="span" fontWeight="bold">&nbsp;&nbsp;</Text>
                                    <Text as="span" fontWeight="bold">Quantity: </Text>
                                    <Text as="span">{quantity}</Text>
                                </Text>
                            </Text>
                        </Flex>
                    </Flex>
                ) : (
                    <EditItemForm id={id} item={item} category={category} quantity={quantity} purchase_date={purchase_date} expiry_date={expiry_date} onClose={handleCloseEditForm} fetchInventoryItems={fetchInventoryItems}/>
                )}
            </Box>
            <Box p={4}>
                {!isEditing ? (
                    <>
                        <Text><Text as="span" fontWeight="bold">Category: </Text><Text as="span">{category}</Text></Text>
                        <Text><Text as="span" fontWeight="bold">Purchase Date: </Text><Text as="span">{purchase_date}</Text></Text>
                        <Text><Text as="span" fontWeight="bold">Expiry Date: </Text><Text as="span">{expiry_date}</Text></Text>
                        <Box display="flex" flexDirection="column" alignItems="center" w="full">
                        <Stack direction="row" spacing={8} mt={3}>
                            <Flex gap={2}>
                                <Button bg="green.400" color="white" size="lg" _hover={{ bg: "green.600" }} onClick={() => onDecrement(id, 1)}>Use 1</Button>
                                <Button bg="green.500" color="white" size="lg" _hover={{ bg: "green.700" }} onClick={handleDecrementBy5}>Use 5</Button>
                                <Button bg="green.600" color="white" size="lg" _hover={{ bg: "green.800" }} onClick={handleDecrementBy10}>Use 10</Button>
                            </Flex>
                        </Stack>
                        <Stack direction="row" spacing={8} mt={3}>
                            <Flex gap={2}>
                                <Text></Text>
                                <Button bg="danger.800" color="white" size="lg" _hover={{ bg: "danger.900" }} onClick={onDelete}>Delete</Button>
                                <Button bg="primary.700" color="white" size="lg" _hover={{ bg: "primary.800" }} onClick={handleEdit}>Edit</Button>
                            </Flex>
                        </Stack>
                        </Box>
                    </>
                ) : (
                    <EditItemForm id={id} item={item} category={category} quantity={quantity} purchase_date={purchase_date} expiry_date={expiry_date} onClose={handleCloseEditForm} fetchInventoryItems={fetchInventoryItems}/>
                )}
            </Box>
        </Box>
    );
};

export default InventoryItem;
