import React from 'react';

function RecipeCard({ recipe, onRecipeSelect }) {
    return (
        <div className="recipe-card" onClick={() => onRecipeSelect(recipe)}>
            <h3>{recipe.recipe_name}</h3>
        </div>
    );
}

export default RecipeCard;
