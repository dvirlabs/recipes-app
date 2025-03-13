import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipe from "./AddRecipe";
import "../style/recipeList.css";
import { GiTrashCan } from "react-icons/gi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Confirmation from "./ConfirmDialog";

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
    setEditRecipe({ ...recipe });  // Pass the current recipe details for editing
  };

  const closePopup = () => {
    setSelectedRecipe(null);
    setEditRecipe(null); // Close edit popup when done
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
          fetchRecipes(); // Refresh the recipe list
          setEditRecipe(null); // Close the edit form
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
      {editRecipe && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h2>ערוך מתכון</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit(editRecipe);
              }}
            >
              <input
                type="text"
                name="name"
                value={editRecipe.name}
                onChange={(e) =>
                  setEditRecipe({ ...editRecipe, name: e.target.value })
                }
                placeholder="שם המתכון"
              />
              <input
                type="text"
                name="pic"
                value={editRecipe.pic}
                onChange={(e) =>
                  setEditRecipe({ ...editRecipe, pic: e.target.value })
                }
                placeholder="תמונה"
              />
              <input
                type="number"
                name="prep_time"
                value={editRecipe.prep_time}
                onChange={(e) =>
                  setEditRecipe({ ...editRecipe, prep_time: e.target.value })
                }
                placeholder="זמן הכנה"
              />
              <label>🛒 מרכיבים</label>
              <ul>
                {editRecipe.ingrids.map((ingredient, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) =>
                        setEditRecipe({
                          ...editRecipe,
                          ingrids: editRecipe.ingrids.map((item, i) =>
                            i === index ? e.target.value : item
                          ),
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
              <label>👩‍🍳 שלבים</label>
              <ul>
                {editRecipe.steps.map((step, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) =>
                        setEditRecipe({
                          ...editRecipe,
                          steps: editRecipe.steps.map((item, i) =>
                            i === index ? e.target.value : item
                          ),
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
              <button type="submit">שמור שינויים</button>
              <button type="button" onClick={closePopup}>
                סגור
              </button>
            </form>
          </div>
        </div>
      )}

      <AddRecipe onRecipeAdded={fetchRecipes} />
    </div>
  );
}

export default RecipeList;
