import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipe from "./AddRecipe";
import "../style/recipeList.css";
import { GiTrashCan } from "react-icons/gi";
import Confirmation from "./ConfirmDialog"; // Import the Confirmation component

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  const fetchRecipes = () => {
    fetch("http://localhost:8000/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  };

  const deleteRecipe = (recipeName) => {
    fetch(`http://localhost:8000/recipes/${recipeName}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchRecipes(); // Refresh the recipe list after successful deletion
        } else {
          console.error("Error deleting recipe");
        }
      })
      .catch((error) => console.error("Error deleting recipe:", error));
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

  const handleDeleteClick = (recipeName) => {
    setRecipeToDelete(recipeName);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (recipeToDelete) {
      deleteRecipe(recipeToDelete);
    }
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="recipe-list">
      <h1>רשימת מתכונים</h1>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-square" onClick={() => handleClick(recipe)}>
            <GiTrashCan
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(recipe.name);
              }}
            />
            <img src={recipe.pic} alt={recipe.name} />
            <h3>{recipe.name}</h3>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <Confirmation
          message="אתה בטוח שאתה רוצה למחוק את המתכון ?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {selectedRecipe && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={closePopup}>סגור</button>
            <RecipeCard recipe={selectedRecipe} />
          </div>
        </div>
      )}

      <AddRecipe onRecipeAdded={fetchRecipes} />
    </div>
  );
}

export default RecipeList;
