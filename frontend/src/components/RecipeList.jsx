import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipe from "./AddRecipe";
import "../style/recipeList.css";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = () => {
    fetch("http://localhost:8000/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closePopup = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-list">
      <h1>Recipe List</h1>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-square" onClick={() => handleClick(recipe)}>
            <img src={recipe.pic} alt={recipe.name} />
            <h3>{recipe.name}</h3>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={closePopup}>Close</button>
            <RecipeCard recipe={selectedRecipe} />
          </div>
        </div>
      )}

      <AddRecipe onRecipeAdded={fetchRecipes} />
    </div>
  );
}

export default RecipeList;
