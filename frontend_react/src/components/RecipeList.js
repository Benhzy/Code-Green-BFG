import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import './RecipeList.css';
import { apiUrl } from './IpAdr';

function RecipeList({ userId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Abstracted fetch function
    const fetchRecipes = async (url) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setRecipes(data);
                return data; // Return the fetched data
            } else {
                throw new Error('Failed to fetch recipes');
            }
        } catch (error) {
            setError('Error fetching recipes: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(`${apiUrl}/recipe/${userId}`);
    }, [userId]);

    const fetchRecommendedRecipes = async (cuisine = 'Singaporean') => {
        const recommendedRecipes = await fetchRecipes(`${apiUrl}/recommend_recipe/${userId}?cuisine=${cuisine}`);
        if (recommendedRecipes && recommendedRecipes.length > 0) {
            handleRecipeSelect(recommendedRecipes[0]); // Automatically select the first recipe
        }
    };

    const handleRecipeSelect = (recipe) => {
        setSelectedRecipe(recipe);
        onOpen();
    };

    const logRecipe = async () => {
        const url = `${apiUrl}/add_recipe`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRecipe)
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Failed to log the recipe');
            alert('Recipe logged successfully!');
        } catch (error) {
            alert('Error logging the recipe: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Recipes</h1>
            <button onClick={() => fetchRecommendedRecipes()}>Get Recommended Recipes</button>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {recipes.map((recipe, index) => (
                    <li key={index} onClick={() => handleRecipeSelect(recipe)}>
                        {recipe.recipe_name}
                    </li>
                ))}
            </ul>
            {selectedRecipe && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedRecipe.recipe_name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <h2>{selectedRecipe.recipe_name}</h2>
                            <p><strong>Description:</strong> {selectedRecipe.description}</p>
                            <p><strong>Ingredients:</strong> {selectedRecipe.ingredients}</p>
                            <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
                            <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
                            <p><strong>Time Required:</strong> {selectedRecipe.time_required}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={logRecipe}>
                                I Cooked This!
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}

export default RecipeList;
