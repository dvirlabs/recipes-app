import React from "react";
import "../style/recipeCard.css";

function RecipeCard({ recipe }) {
  // Ensure ingredients and steps are arrays, fallback to empty array if not
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <div className="recipe-card">
      <img src={recipe.pic} alt={recipe.name} />
      <h3>{recipe.name}</h3>

      <h4>Ingredients:</h4>
      <ul>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))
        ) : (
          <li>No ingredients available</li>
        )}
      </ul>

      <h4>Steps:</h4>
      <ul>
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <li key={index} className="step">
              Step {index + 1}: {step}
            </li>
          ))
        ) : (
          <li>No steps available</li>
        )}
      </ul>

      <h4>Preparation Time:</h4>
      <p>{recipe.prep_time}</p>

    </div>
  );
}

export default RecipeCard;
