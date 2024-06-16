import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast 
} from '@chakra-ui/react';

import { apiUrl } from './IpAdr';
// npm install @react-sandbox/heart if necessary
import Heart from '@react-sandbox/heart'

function RecipeModal({ isOpen, onClose, recipe, onLogRecipe }) {
    const toast = useToast();
    const [active, setActive] = useState(false)
    const parseIngredients = (ingredientsStr) => {
        return ingredientsStr.slice(1, -1).split("), (").map(item =>
            item.replace(/[()']/g, '').split(", ")
        ).map(item => ({
            name: item[0],
            quantity: item[1]
        }));
    };

    const parseInstructions = (instructionsStr) => {
        return instructionsStr.slice(2, -2).split("', '").map(instruction =>
            instruction.trim().replace(/^'/, "").replace(/'$/, "")
        );
    };

    const handleEditIngredients = async (recipe) => {
        const ingredients = parseIngredients(recipe.ingredients);
        for (const ingredient of ingredients) {
            try {
                const response = await fetch(`${apiUrl}/update_inventory`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: 5, // Assuming user ID is static as 5
                        item: ingredient.name,
                        quantity: ingredient.quantity, // Directly use the parsed quantity
                    }),
                });
    
                const result = await response.json();
    
                if (!response.ok) {
                    throw new Error(result.error || 'Failed to update inventory');
                }
            } catch (error) {
                // Utilize a toast to display error messages
                toast({
                    title: "Error Updating Inventory",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                return; // Stop further execution on error
            }
        }
    
        toast({
            title: "Inventory Updated Successfully",
            description: "All ingredients have been updated in the inventory.",
            status: "success",
            duration: 5000,
            isClosable: true
        });
    
        // Optional: Refresh inventory list or close modal
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <Heart
                width={45}
                height={45}
                active={active}
                onClick={() => setActive(!active)}
            />
                <ModalHeader>{recipe.recipe_name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <h2>Ingredients</h2>
                    <ul>
                        {parseIngredients(recipe.ingredients).map((ingredient, index) => (
                            <li key={index}>{ingredient.name}: {ingredient.quantity}</li>
                        ))}
                    </ul>
                    <h2>Instructions</h2>
                    <ol>
                        {parseInstructions(recipe.instructions).map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => handleEditIngredients(recipe)}>
                        I Cooked This!
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RecipeModal;
