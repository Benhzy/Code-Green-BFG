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
import RecipeCard from './RecipeCard';

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
    const deleteRecipeFromServer = async (recipeId) => {
        const url = `${apiUrl}/delete_recipe/${recipeId}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Failed to delete the recipe');
            alert('Recipe deleted successfully!');
            // Update the recipes list by removing the deleted recipe
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
        } catch (error) {
            alert('Error deleting the recipe: ' + error.message);
        }
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
    const parseIngredients = (ingredientsStr) => {
        try {
            // Remove the enclosing square brackets and then split the string on "), (" to get each tuple-like substring
            const ingredientsArray = ingredientsStr.slice(1, -1).split("), (").map(item =>
                // Remove the parentheses and any single quotes, then split each string into ingredient name and quantity
                item.replace(/[()']/g, '').split(", ")
            );
    
            // Convert each tuple-like array into an object with name and quantity properties
            return ingredientsArray.map(item => ({
                name: item[0],
                quantity: item[1]
            }));
        } catch (error) {
            console.error('Failed to parse ingredients:', error);
            return [];
        }
    };
    
    
    const parseInstructions = (instructionsStr) => {
        try {
            // Remove the square brackets and split the string into array entries
            return instructionsStr.slice(2, -2).split("', '").map(instruction =>
                instruction.trim().replace(/^'/, "").replace(/'$/, "")
            );
        } catch (error) {
            console.error('Failed to parse instructions:', error);
            return [];
        }
    };
    return (
        <div>
            <h1>Recipes</h1>
            <button onClick={() => fetchRecommendedRecipes()}>Get Recommended Recipes</button>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div>
                {recipes.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} onRecipeSelect={handleRecipeSelect} />
                ))}
            </div>
            {selectedRecipe && (
                <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedRecipe.recipe_name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <h2>Ingredients</h2>
                        <ul>
                            {parseIngredients(selectedRecipe.ingredients).map((ingredient, index) => (
                                <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                            ))}
                        </ul>
                        <h2>Instructions</h2>
                        <ol>
                            {parseInstructions(selectedRecipe.instructions).map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
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