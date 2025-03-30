import React, { useState } from "react";
import "../style/editRecipe.css";

function EditRecipe({ recipe, onSave, onClose }) {
  const [editedRecipe, setEditedRecipe] = useState(recipe ? { ...recipe } : {
    name: "",
    pic: "",
    prep_time: 5,
    ingrids: [],
    steps: []
  });

  if (!recipe) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, value) => {
    setEditedRecipe((prev) => ({
      ...prev,
      ingrids: prev.ingrids.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleStepChange = (index, value) => {
    setEditedRecipe((prev) => ({
      ...prev,
      steps: prev.steps.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(editedRecipe);
  };

  return (
    <div className="edit-popup">
      <div className="edit-popup-content">
        <h2>ערוך מתכון</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            name="name"
            value={editedRecipe.name}
            onChange={handleChange}
            placeholder="שם המתכון"
          />
          <input
            type="text"
            name="pic"
            value={editedRecipe.pic}
            onChange={handleChange}
            placeholder="תמונה"
          />
          <label>⏳ זמן הכנה: {editedRecipe.prep_time} דקות</label>
          <input
            type="range"
            name="prep_time"
            min="5"
            max="120"
            step="5"
            value={editedRecipe.prep_time}
            onChange={handleChange}
          />
          <label>🛒 מרכיבים</label>
          <ul>
            {editedRecipe.ingrids.map((ingredient, index) => (
              <li key={index}>
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <label>👩‍🍳 שלבים</label>
          <ul>
            {editedRecipe.steps.map((step, index) => (
              <li key={index}>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <div className="buttons">
            <button type="submit">שמור שינויים</button>
            <button type="button" onClick={onClose}>סגור</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRecipe;
