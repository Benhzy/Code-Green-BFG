import React, { useState, useEffect } from 'react';
import './RecipeList.css';

function RecipeList({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecipes();
    }, [userId]);

    const fetchRecipes = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/recipe/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setRecipes(data);
            } else {
                throw new Error('Failed to fetch recipes');
            }
        } catch (error) {
            setError('Error fetching recipes: ' + error.message);
        }
        setIsLoading(false);
    };

    const fetchRecommendedRecipes = async (cuisine = 'Singaporean') => {
        setIsLoading(true);
        setError('');
        try {
            const url = `http://localhost:5000/recommend_recipe/${userId}?cuisine=${cuisine}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setRecipes(data); // Assuming the response structure is suitable for setting directly to recipes
            } else {
                throw new Error('Failed to fetch recommended recipes');
            }
        } catch (error) {
            setError('Error fetching recommended recipes: ' + error.message);
        }
        setIsLoading(false);
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
