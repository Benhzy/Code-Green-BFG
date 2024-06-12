import React, { useState } from 'react';
import { Button, Box, Text, Stack } from '@chakra-ui/react';
import EditItemForm from './EditItemForm'; // Import the EditItemForm component

const InventoryItem = ({ id, item, category, quantity, purchase_date, expiry_date, onDecrement, onDelete, fetchInventoryItems }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCloseEditForm = () => {
        setIsEditing(false);
    };

    return (
        <Box className="inventory-item" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            {!isEditing ? (
                <>
                    <Text fontSize="2xl" fontWeight="bold">{item}</Text>
                    <Text>
                        <Text as="span" fontWeight="bold"> Category: </Text>
                        <Text as="span">{category}</Text>
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold">Quantity: </Text> 
                        <Text as="span"> {quantity} </Text>
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold"> Purchase Date: </Text>
                        <Text as="span"> {purchase_date}</Text>
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold">Expiry Date: </Text>
                        <Text as="span">{expiry_date} </Text>
                    </Text>
                    <Stack direction="row" spacing={4} mt={4}>
                        <Button colorScheme="orange" onClick={() => onDecrement(id, 1)}>Decrement</Button>
                        <Button colorScheme="red" onClick={() => onDelete(id)}>Delete</Button>
                        <Button colorScheme="green" onClick={handleEdit}>Edit</Button>
                    </Stack>
                </>
            ) : (
                <EditItemForm
                    id={id}
                    item={item}
                    category={category}
                    quantity={quantity}
                    purchase_date={purchase_date}
                    expiry_date={expiry_date}
                    onClose={handleCloseEditForm}
                    fetchInventoryItems={fetchInventoryItems}
                />
            )}
        </Box>
    );
};

export default InventoryItem;
