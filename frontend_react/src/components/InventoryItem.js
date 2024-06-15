import React, { useState } from 'react';
import { Button, Box, Text, Stack, Flex, Divider,} from '@chakra-ui/react';
import EditItemForm from './EditItemForm';

// Mapping categories to emojis
const categoryEmojis = {
    Fruit: "🍎",
    Vegetable: "🥦",
    Dairy: "🥛",
    Meat: "🍖",
    Grain: "🥐",
    Seafood: "🐟",
    Condiment: "🧂",
    "Dried Good": "🍪",
    "Canned Food": "🥫",
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
    const wordHighlight = daysUntilExpiry <= 0 ? "red.300" : daysUntilExpiry <= 5 ? "orange.300" : "green.300";

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


    return (
        <Box
            className="inventory-item"
            p={0}
            borderWidth="0px"
            borderRadius="2xl"
            overflow="auto"
            borderColor="black"
            sx={{
                boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)" // Custom shadow casting to the right and bottom
            }}
            width="200px"

            >
            <Box bg={boxColor}>
                {!isEditing ? (
                    <Flex align="center" justify="flex-start" spacing="4">
                        <Text paddingLeft="6px" fontSize="5xl">{getEmoji(category)}</Text>
                        <Flex align="center" justify="left">
                            <Text w="full">
                                <Text fontSize="md" fontWeight="bold" ml="2" lineHeight="3" paddingTop={0.5}>{item}</Text>
                                <Divider height="1px" borderColor="transparent"/>
                                <Text fontSize="xs" padding={0}>
                                    <Text as="span" fontWeight="bold" paddingLeft="1px">&nbsp;&nbsp;</Text>
                                    <Text as="span" fontWeight="bold" lineHeight="1">Amt: </Text>
                                    <Text as="span">{quantity}</Text>
                                </Text>
                            </Text>
                        </Flex>
                    </Flex>
                ) : (
                    <EditItemForm id={id} item={item} category={category} quantity={quantity} purchase_date={purchase_date} expiry_date={expiry_date} onClose={handleCloseEditForm} fetchInventoryItems={fetchInventoryItems}/>
                )}
            </Box>
            <Box paddingLeft="0px">
                {!isEditing ? (
                    <>
                        {/* <Text><Text as="span" fontWeight="bold">Category: </Text><Text as="span">{category}</Text></Text> */}
                        <Text paddingLeft="12px" fontSize="sm" paddingTop="6px"><Text as="span" fontWeight="bold" >🛒: </Text><Text as="span">{purchase_date}</Text></Text>
                        <Text paddingLeft="12px" fontSize="sm" paddingTop="2px" paddingBottom="0px">
                            <Text as="span">🚮: </Text>
                            <Text as="span">{expiry_date}</Text>
                            <Text as="span" color={wordHighlight} fontWeight="bold" fontSize="xs"> ({daysUntilExpiry}d left)</Text>
                        </Text>
                        <Box display="flex" flexDirection="column" alignItems="center" w="full">
                        {/* <Stack direction="row" spacing={5} mt={1}>
                            <Flex gap={1} align="center">
                                <Button  color="black" fontSize="sm" size="xs" width="85px" height="40px" border="1px solid"  borderColor="gray.700"
                                _hover={{ bg: "gray.600", color: 'white' }} onClick={() => onDecrement(id, 1)}>Use 1</Button>
                                <Button color="black" fontSize="sm" size="xs" width="85px" height="40px" border="1px solid"  borderColor="gray.700"
                                _hover={{ bg: "gray.600", color: 'white'}} onClick={handleDecrementBy5}>Use 5</Button>
                            </Flex>
                        </Stack> */}
                        <Stack direction="row" spacing={5} mt={2}>
                            <Flex gap={2} align="center" paddingBottom="10px">
                                <Button bg="#EDF2F7" color="#888888" fontSize="sm" size="xs" width="85px" height="40px" _hover={{ bg: "primary.800" }} onClick={handleEdit}>Edit</Button>
                                <Button bg="red.200" color="black" fontSize="sm" size="xs" width="85px" height="40px" _hover={{ bg: "danger.900" }} onClick={onDelete}>Delete</Button>
                                
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
