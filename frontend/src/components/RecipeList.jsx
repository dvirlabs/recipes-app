import React, { useEffect, useState } from "react";
import RecipeCard from './RecipeCard';
import "../style/recipeList.css";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/recipes") // Make sure the URL matches your FastAPI endpoint
      .then(response => response.json())
      .then(data => setRecipes(data));
  }, []);

  const handleClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closePopup = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-list">
      <h1>Recipe List</h1> {/* Title added here */}
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="recipe-square"
            onClick={() => handleClick(recipe)}
          >
            <img
              src={recipe.pic}  // Using pic field from MongoDB
              alt={recipe.name}
              width={30}
              height={30}
              style={{ borderRadius: "50%" }}
            />
            <h3>{recipe.name}</h3>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="popup">
          <div className="popup-content">
            <RecipeCard recipe={selectedRecipe} />
          </div>
            <button onClick={closePopup}>Close</button>
        </div>
      )}
    </div>
  );
}

export default RecipeList;
