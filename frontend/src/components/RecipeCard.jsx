import React from "react";
import "../style/recipeCard.css";

function RecipeCard({ recipe }) {
  const ingredients = recipe.ingrids ? Object.values(recipe.ingrids) : [];
  const steps = recipe.steps ? Object.values(recipe.steps) : [];

  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <img src={recipe.pic} alt={recipe.name} />

      <h4>:זמן הכנה</h4>
      <p>{recipe.prep_time || "Not specified"}</p>

      <h4>:מצרכים</h4>
      <ul>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)
        ) : (
          <li>No ingredients available</li>
        )}
      </ul>

      <h4>:שלבי הכנה</h4>
      <ul>
        {steps.length > 0 ? (
          steps.map((step, index) => <li key={index}>שלב {index + 1}: {step}</li>)
        ) : (
          <li>No steps available</li>
        )}
      </ul>
    </div>
  );
}

export default RecipeCard;
