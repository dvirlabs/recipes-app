import React, { useState } from "react";
import "../style/addRecipe.css";
import { FaRegSquarePlus } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";

function AddRecipe({ onRecipeAdded }) {
  const [showPopup, setShowPopup] = useState(false);
  const [recipe, setRecipe] = useState({
    name: "",
    pic: "",
    prep_time: 10, // ברירת מחדל ל-10 דקות
    ingrids: [],
    steps: [],
  });

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      setRecipe({
        name: "",
        pic: "",
        prep_time: 10,
        ingrids: [],
        steps: [],
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          pic: data.imageUrl,
        }));
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // הוספת מרכיב חדש
  const addIngredient = () => {
    if (recipe.ingridsText) {
      setRecipe((prev) => ({
        ...prev,
        ingrids: [...prev.ingrids, prev.ingridsText],
        ingridsText: "",
      }));
    }
  };

  // מחיקת מרכיב
  const removeIngredient = (index) => {
    setRecipe((prev) => ({
      ...prev,
      ingrids: prev.ingrids.filter((_, i) => i !== index),
    }));
  };

  // הוספת שלב הכנה חדש
  const addStep = () => {
    if (recipe.stepsText) {
      setRecipe((prev) => ({
        ...prev,
        steps: [...prev.steps, prev.stepsText],
        stepsText: "",
      }));
    }
  };

  // מחיקת שלב הכנה
  const removeStep = (index) => {
    setRecipe((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedRecipe = {
      name: recipe.name,
      pic: recipe.pic,
      prep_time: recipe.prep_time,
      ingrids: recipe.ingrids, // עכשיו נשלח כמערך
      steps: recipe.steps, // עכשיו נשלח כמערך
    };
  
    try {
      const response = await fetch("http://localhost:8000/add_recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedRecipe),
      });
  
      if (response.ok) {
        onRecipeAdded();
        setRecipe({
          name: "",
          pic: "",
          prep_time: 10,
          ingrids: [],
          steps: [],
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
            <h2>הוסף מתכון</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="שם מתכון"
                value={recipe.name}
                onChange={handleChange}
                required
              />

              {/* כפתור העלאת תמונה */}
              <label htmlFor="file-upload" className="custom-file-upload">
                בחר תמונה
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                style={{ display: "none" }} // הסתרת ה-input המקורי
              />

              {recipe.pic && <img src={recipe.pic} alt="תצוגה מקדימה" width="100" />}

              {/* זמן הכנה עם סליידר */}
              <label>⏳ זמן הכנה: {recipe.prep_time} דקות</label>
              <input
                type="range"
                name="prep_time"
                min="5"
                max="120"
                step="5"
                value={recipe.prep_time}
                onChange={handleChange}
              />

              {/* הוספת מרכיבים */}
              <label>🛒 מרכיבים</label>
              <div className="input-group">
                <input
                  type="text"
                  name="ingridsText"
                  placeholder="הוסף מרכיב"
                  value={recipe.ingridsText || ""}
                  onChange={handleChange}
                />
                  <FaRegSquarePlus onClick={addIngredient}/> {/* הוספת האייקון */}
              </div>
              <ul>
                {recipe.ingrids.map((item, index) => (
                  <li key={index}>
                    {item} <GiCancel className="cancel-icon" onClick={() => removeIngredient(index)} />
                  </li>
                ))}
              </ul>

              {/* הוספת שלבי הכנה */}
              <label>👨‍🍳 שלבי הכנה</label>
              <div className="input-group">
                <input
                  type="text"
                  name="stepsText"
                  placeholder="הוסף שלב"
                  value={recipe.stepsText || ""}
                  onChange={handleChange}
                />
                  <FaRegSquarePlus onClick={addStep}/> {/* הוספת האייקון */}
              </div>
              <ol>
                {recipe.steps.map((item, index) => (
                  <li key={index}>
                    {item} <GiCancel className="cancel-icon" onClick={() => removeStep(index)} />
                  </li>
                ))}
              </ol>

              <div className="buttons">
                <button type="submit" className="submit-btn">הוסף מתכון</button>
                <button type="button" className="close-btn" onClick={togglePopup}>סגור</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddRecipe;
