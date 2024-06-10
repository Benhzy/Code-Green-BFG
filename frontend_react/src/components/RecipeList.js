import React, { useState, useEffect } from 'react';
import './RecipeList.css';

function RecipeList({ userId }) {
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
        // Fetch initial recipe list
        fetchRecipes(`http://localhost:5000/recipe/${userId}`);
    }, [userId]);

    const fetchRecommendedRecipes = async (cuisine = 'Singaporean') => {
        // Fetch recommended recipes, then refresh the list from the database
        await fetchRecipes(`http://localhost:5000/recommend_recipe/${userId}?cuisine=${cuisine}`);
        // Optionally, re-fetch the complete list if needed or just update the list with new recommendations
        fetchRecipes(`http://localhost:5000/recipe/${userId}`);
    };

    return (
        <div>
            <h1>Recipes</h1>
            <button onClick={() => fetchRecommendedRecipes()}>Get Recommended Recipes</button>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {recipes.map((recipe, index) => (
                    <li key={index} onClick={() => setSelectedRecipe(recipe)}>
                        {recipe.recipe_name}
                    </li>
                ))}
            </ul>
            {selectedRecipe && (
                <div className="recipe-details">
                    <h2>{selectedRecipe.recipe_name}</h2>
                    <p><strong>Description:</strong> {selectedRecipe.description}</p>
                    <p><strong>Ingredients:</strong> {selectedRecipe.ingredients}</p>
                    <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
                    <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
                    <p><strong>Time Required:</strong> {selectedRecipe.time_required}</p>
                </div>
            )}
        </div>
    );
}

export default RecipeList;
