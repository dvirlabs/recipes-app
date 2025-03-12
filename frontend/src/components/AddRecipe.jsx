import React, { useState } from "react";
import "../style/addRecipe.css";

function AddRecipe({ onRecipeAdded }) {
  const [showPopup, setShowPopup] = useState(false);
  const [recipe, setRecipe] = useState({
    name: "",
    pic: "",
    prep_time: "",
    ingrids: "",
    steps: "",
  });

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      // Reset form when opening popup
      setRecipe({
        name: "",
        pic: "",
        prep_time: "",
        ingrids: "",
        steps: "",
      });
    }
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

    const formattedRecipe = {
      name: recipe.name,
      pic: recipe.pic,
      prep_time: recipe.prep_time,
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
        // ✅ Reset form after successful submission
        setRecipe({
          name: "",
          pic: "",
          prep_time: "",
          ingrids: "",
          steps: "",
        });
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
      <button className="add-recipe-btn" onClick={togglePopup}>
        +
      </button>

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
              <input
                type="text"
                name="prep_time"
                placeholder="Preparation Time"
                value={recipe.prep_time}
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
