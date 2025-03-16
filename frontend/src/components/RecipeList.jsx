import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipe from "./AddRecipe";
import "../style/recipeList.css";
import { GiTrashCan } from "react-icons/gi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Confirmation from "./ConfirmDialog";
import EditRecipe from "./EditRecipe";  // Import the new component

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);

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
          fetchRecipes();
        } else {
          console.error("Error deleting recipe");
        }
      })
      .catch((error) => console.error("Error deleting recipe:", error));
  };

  const handleEditClick = (recipe) => {
    setEditRecipe({ ...recipe });
  };

  const closePopup = () => {
    setSelectedRecipe(null);
    setEditRecipe(null);
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

  const handleEditSubmit = (updatedRecipe) => {
    fetch(`http://localhost:8000/recipes/${updatedRecipe.name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipe),
    })
      .then((response) => {
        if (response.ok) {
          fetchRecipes();
          setEditRecipe(null);
        } else {
          console.error("Error updating recipe");
        }
      })
      .catch((error) => console.error("Error updating recipe:", error));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="recipe-list">
      <h1>רשימת מתכונים</h1>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="recipe-square"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <GiTrashCan
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(recipe.name);
              }}
            />
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(recipe);
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

      {/* Edit Recipe Popup */}
      <EditRecipe
        editRecipe={editRecipe}
        setEditRecipe={setEditRecipe}
        handleEditSubmit={handleEditSubmit}
        closePopup={closePopup}
      />

      <AddRecipe onRecipeAdded={fetchRecipes} />
    </div>
  );
}

export default RecipeList;
