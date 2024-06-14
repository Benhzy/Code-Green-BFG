import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';


import Heart from '@react-sandbox/heart'

function RecipeModal({ isOpen, onClose, recipe, onLogRecipe }) {
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
                    <Button colorScheme="blue" mr={3} onClick={() => onLogRecipe(recipe)}>
                        I Cooked This!
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RecipeModal;
