import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
  IconButton,
  Switch,
  Flex,
  useToast,
  FormLabel
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { apiUrl } from './IpAdr';
import IngredientItem from './IngredientItem';
import './RecipeList.css';

const RecipeList = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [servings, setServings] = useState(1);
  const [preferences, setPreferences] = useState('No preferences');
  const [inventory, setInventory] = useState([]);
  const [showExpiring, setShowExpiring] = useState(false);
  const toast = useToast();

  const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchRecommendedRecipes = async (cuisine = 'Singaporean') => {
    const recommendedRecipes = await fetchRecipes(`${apiUrl}/recommend_recipe/${userId}?cuisine=${cuisine}`);
    if (recommendedRecipes && recommendedRecipes.length > 0) {
        handleRecipeSelect(recommendedRecipes[0]); // Automatically select the first recipe
    }
};

  const fetchRecipes = async (url) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setError(`Error fetching recipes: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(`${apiUrl}/recipe/${userId}`);
  }, [userId]);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/grocery/${userId}`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to fetch inventory');
      }
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      toast({
        title: "Error fetching inventory",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, [userId]);



  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    onOpen();
};

  const filteredInventory = useMemo(() => {
    return showExpiring
      ? inventory.filter(item => calculateDaysUntilExpiry(item.expiry_date) <= 5)
      : inventory;
  }, [inventory, showExpiring]);

  return (
    <Box p={4}>
      <Heading mb={4}>Recipe Generator</Heading>
      <Text mb={4}>Time to create some magic in the kitchen! Select the ingredients you would like to cook with.</Text>
      <Stack spacing={4} mb={4}>
        <Box width="100%">
          <Flex align="center" mb={4}>
            <FormLabel mb={1}>Servings</FormLabel>
            <NumberInput min={1} value={servings} onChange={(valueString) => setServings(parseInt(valueString))} width="100%" position="relative">
              <NumberInputStepper position="absolute" left="0">
                <IconButton
                  aria-label="Decrement"
                  icon={<MinusIcon />}
                  size="md"
                  onClick={() => setServings((prevServings) => (prevServings > 1 ? prevServings - 1 : 1))}
                />
              </NumberInputStepper>
              <NumberInputField pl="2rem" pr="2rem" paddingLeft="53px" textAlign="center" />
              <NumberInputStepper position="absolute" right="4">
                <IconButton
                  aria-label="Increment"
                  icon={<AddIcon />}
                  size="md"
                  onClick={() => setServings((prevServings) => prevServings + 1)}
                />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <Flex align="center" mb={4}>
            <FormLabel mb={1}>Preferences:</FormLabel>
            <Input
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="I want something with BBQ sauce..."
              maxLength={200}
              width="100%"
            />
          </Flex>
        </Box>
        <Flex align="center">
          <Text mr={2}>Ingredients:</Text>
          <Stack direction="row" spacing={4}>
            <Switch
              isChecked={!showExpiring}
              onChange={() => setShowExpiring(false)}
            />
            <Text>All</Text>
            <Switch
              isChecked={showExpiring}
              onChange={() => setShowExpiring(true)}
            />
            <Text>Expiring</Text>
          </Stack>
        </Flex>
      </Stack>
      {isLoading && <Text>Loading...</Text>}
      {error && (
        <Text color="red.500">{error}</Text>
      )}
      <Box>
        {filteredInventory.map((item, index) => (
          <IngredientItem key={index} {...item} fetchInventoryItems={fetchInventoryItems} userId={userId} />
        ))}
      </Box>
      <Button onClick={() => fetchRecommendedRecipes()}colorScheme="teal" mt={4}>Generate Recipe</Button>
    </Box>
  );
};

export default RecipeList;
