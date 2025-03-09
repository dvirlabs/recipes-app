import React, { useState } from "react";
import "../style/addRecipe.css";

function AddRecipe({ onRecipeAdded }) {
  const [showPopup, setShowPopup] = useState(false);
  const [recipe, setRecipe] = useState({
    name: "",
    pic: "",
    ingrids: "",
    steps: "",
  });

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert ingredients and steps to the correct format
    const formattedRecipe = {
      name: recipe.name,
      pic: recipe.pic,
      ingrids: recipe.ingrids.split("\n").reduce((acc, line, i) => {
        acc[`ingredient ${i + 1}`] = line;
        return acc;
      }, {}),
      steps: recipe.steps.split("\n").reduce((acc, line, i) => {
        acc[`step ${i + 1}`] = line;
        return acc;
      }, {}),
    };

    try {
      const response = await fetch("http://localhost:8000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedRecipe),
      });

      if (response.ok) {
        onRecipeAdded();
        togglePopup();
      } else {
        console.error("Failed to add recipe");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {/* Floating Plus Button */}
      <button className="add-recipe-btn" onClick={togglePopup}>
        +
      </button>

      {/* Popup Form */}
      {showPopup && (
        <div className="add-recipe-popup">
          <div className="add-recipe-content">
            <h2>Add Recipe</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Recipe Name"
                value={recipe.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="pic"
                placeholder="Image URL"
                value={recipe.pic}
                onChange={handleChange}
                required
              />
              <textarea
                name="ingrids"
                placeholder="Ingredients (one per line)"
                value={recipe.ingrids}
                onChange={handleChange}
                rows="4"
                required
              />
              <textarea
                name="steps"
                placeholder="Steps (one per line)"
                value={recipe.steps}
                onChange={handleChange}
                rows="4"
                required
              />
              <div className="buttons">
                <button type="submit" className="submit-btn">
                  Add Recipe
                </button>
                <button type="button" className="close-btn" onClick={togglePopup}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddRecipe;
