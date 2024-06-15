import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Link, HStack, Text, Stack } from '@chakra-ui/react';
import AddItemForm from './AddItemForm';

const BottomMenuBar = ({ fetchInventoryItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const navigate = useNavigate();

    const toggleButtons = () => {
        setIsOpen(!isOpen);
    };

    const openForm = () => {
        setIsFormOpen(true);
        setIsOpen(false); // Close the floating buttons when form is opened
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const handleScanReceiptClick = () => {
        navigate('/scanner'); // Redirect to the camera page
    };

    return (
        <Box position="fixed" bottom="0" left="0" right="0" width="100%" bg="white" py={4} borderRadius="25px 25px 0 0" height="85px" 
        boxShadow="dark-lg">
            <Flex justify="space-around" alignItems="center" height="100%">
                <Link as={RouterLink} to="/groceries" textDecoration="none">
                    <Button bg="white" align="center" color="#4A4A4A" borderRadius="25px" width="80px" height="50px" _hover={{ bg: "#cff1e6" }}>
                        <Stack spacing={0}>
                            <Text>🛒</Text>
                            <Text fontSize="xs" paddingTop="5px">Grocery</Text>
                        </Stack>
                        
                    </Button>
                </Link>
                <Link as={RouterLink} to="/recipes" textDecoration="none">
                    <Button bg="white" color="#4A4A4A" borderRadius="25px" width="80px" height="50px" _hover={{ bg: "#cff1e6" }}>
                        <Stack spacing={0}>
                            <Text>📜</Text>
                            <Text fontSize="xs" paddingTop="5px">Recipes</Text>
                        </Stack>
                    </Button>
                </Link>
                <Button bg="#19956d" color="white" borderRadius="25px" justifyContent="center" alignItems="center" display="flex" width="50px" height="50px" zIndex="10" onClick={toggleButtons} _hover={{ bg: "#cff1e6" }}>
                    <Text fontSize="4xl" height="100%" margin="0" padding = "0">+</Text>
                </Button>
                <Link as={RouterLink} to="/dashboard" textDecoration="none">
                    <Button bg="white" color="#4A4A4A" borderRadius="25px" width="80px" height="50px" _hover={{ bg: "#cff1e6" }}>
                        <Stack spacing={0}>
                            <Text>📊</Text>
                            <Text fontSize="xs" paddingTop="5px">Dashboard</Text>
                        </Stack>
                    </Button>
                </Link>
                <Link as={RouterLink} to="/community" textDecoration="none">
                    <Button bg="white" color="#4A4A4A" borderRadius="25px" width="80px" height="50px" _hover={{ bg: "#cff1e6" }}>
                        <Stack spacing={0}>
                            <Text>🌏</Text>
                            <Text fontSize="xs" paddingTop="5px">Community</Text>
                        </Stack>
                    </Button>
                </Link>
            </Flex>

            {isOpen && (
                <HStack position="absolute" bottom="100px" width="100%" justify="center" spacing={2}>
                    <Button bg="#19956d" color="white" borderRadius="20px" width="190px" height="60px" onClick={openForm} _hover={{ bg: "#19956d" }}>
                        Add item
                    </Button>
                    <Button bg="#19956d" color="white" borderRadius="20px" width="190px" height="60px" onClick={handleScanReceiptClick} _hover={{ bg: "#19956d" }}>
                        Scan receipt
                    </Button>
                </HStack>
            )}

            {isFormOpen && <AddItemForm onClose={closeForm} fetchInventoryItems={fetchInventoryItems} />}
        </Box>
    );
};

export default BottomMenuBar;
