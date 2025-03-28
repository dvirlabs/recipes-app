import { useState, useEffect } from "react";
import '../style/recipeForm.css';

const RecipeForm = ({ recipe, onSave, onClose }) => {
  // אם `recipe` קיים, נטען את הערכים שלו. אחרת, ניתן ערכים ריקים
  const [name, setName] = useState(recipe ? recipe.name : "");
  const [pic, setPic] = useState(recipe ? recipe.pic : "");
  const [prepTime, setPrepTime] = useState(recipe ? recipe.prep_time : 0);
  const [ingrids, setIngrids] = useState(recipe ? recipe.ingrids : []);
  const [steps, setSteps] = useState(recipe ? recipe.steps.join("\n") : "");

  const [ingredientText, setIngredientText] = useState("");

  // כדי לעדכן אם `recipe` משתנה (נגיד נפתח פופאפ עם מתכון אחר)
  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setPic(recipe.pic);
      setPrepTime(recipe.prep_time);
      setIngrids(recipe.ingrids);
      setSteps(recipe.steps.join("\n"));
    }
  }, [recipe]);

  const handleAddIngredient = () => {
    if (ingredientText.trim() !== "") {
      setIngrids((prev) => [...prev, ingredientText]);
      setIngredientText("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngrids((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedRecipe = {
      name,
      pic,
      prep_time: prepTime,
      ingrids,
      steps: steps.split("\n"),
    };

    onSave(updatedRecipe); // מעביר את המתכון המעודכן לפונקציה שמטפלת ב-API
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{recipe ? "ערוך מתכון" : "הוסף מתכון"}</h2>
        <label>שם:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>תמונה (URL):</label>
        <input type="text" value={pic} onChange={(e) => setPic(e.target.value)} />

        <label>⏱ זמן הכנה (דקות):</label>
        <input type="number" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />

        <label>🛒 מרכיבים</label>
        <div className="input-group">
          <input type="text" placeholder="הוסף מרכיב" value={ingredientText} onChange={(e) => setIngredientText(e.target.value)} />
          <button onClick={handleAddIngredient}>➕</button>
        </div>
        <ul>
          {ingrids.map((item, index) => (
            <li key={index}>
              {item} <button onClick={() => handleRemoveIngredient(index)}>❌</button>
            </li>
          ))}
        </ul>

        <label>📜 שלבים:</label>
        <textarea value={steps} onChange={(e) => setSteps(e.target.value)} />

        <button onClick={handleSave}>{recipe ? "עדכן" : "שמור"}</button>
        <button onClick={onClose}>ביטול</button>
      </div>
    </div>
  );
};

export default RecipeForm;
