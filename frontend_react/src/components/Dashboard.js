import React from 'react';
import { Box, Heading, Text, Stack, SimpleGrid, Image } from '@chakra-ui/react';

const Dashboard = () => {
    return (
        <Box p={2}>
            <Box display="flex" alignItems="center" justifyContent="center">
                <Image boxSize="30%" src='https://assets-global.website-files.com/5e51c674258ffe10d286d30a/5e5353e82b568af2d916cbbd_peep-26.svg'/>
            </Box>
            <Box>
                <Text fontSize="sm" mb={3}>
                    Welcome to your dashboard! Here you can view all your data in one place.
                </Text>
            </Box>
            <Box>
                <SimpleGrid columns={2} spacing={2}>
                    <Stack paddingLeft = '5px'>
                        <Box 
                        sx={{boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)"}}
                        borderRadius="2xl"
                        p={5}
                        borderWidth="0px"
                        width = "195px"
                        height = "120px"
                        bg = "white"
                        >
                        <Heading as="h2" size="lg" mb={5}>
                            Inventory
                        </Heading>
                        <Text fontSize="md">
                            View your inventory here.
                        </Text>
                        </Box>
                    </Stack>
                    <Stack  paddingRight='5px'>
                        <Box
                        sx={{boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)"}}
                        borderRadius="2xl"
                        p={5}
                        borderWidth="0px"
                        width = "195px"
                        height = "120px"
                        bg = "white"
                        >
                        <Heading as="h2" size="lg" mb={5}>
                            Recipes
                        </Heading>
                        <Text fontSize="md">
                            View your recipes here.
                        </Text>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box
                        sx={{boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)"}}
                        borderRadius="2xl"
                        p={5}
                        borderWidth="0px"
                        width = "195px"
                        height = "120px"
                        bg = "white"
                        >
                        <Heading as="h2" size="lg" mb={5}>
                            Grocery
                        </Heading>
                        <Text fontSize="md">
                            View your grocery list here.
                        </Text>
                        </Box>
                    </Stack>
                    <Stack>
                        <Box
                        sx={{boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)"}}
                        borderRadius="2xl"
                        p={5}
                        borderWidth="0px"
                        width = "195px"
                        height = "120px"
                        bg = "white"
                        >
                        <Heading as="h2" size="lg" mb={5}>
                            Budget
                        </Heading>
                        </Box>
                    </Stack>
                </SimpleGrid>
            </Box>
            <Box paddingTop="10px" position="absolute">
            <Box 
                position="absolute"
                paddingTop="20px"
                sx={{boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.25)"}}
                borderRadius="2xl"
                borderWidth="0px"
                width = "400px"
                height = "120px"
                bg = "white">
                    
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;