import { useState, useEffect } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";

const EditRecipe = ({ recipe, setEditRecipe }) => {
  const [ingredientText, setIngredientText] = useState("");
  const [localRecipe, setLocalRecipe] = useState(null);

  useEffect(() => {
    if (recipe) {
      console.log("Updating localRecipe with:", recipe);
      setLocalRecipe(recipe);
    }
  }, [recipe]);

  if (!localRecipe) {
    return <p>טוען...</p>;
  }

  const handleAddIngredient = () => {
    if (ingredientText.trim() !== "") {
      setLocalRecipe((prev) => ({
        ...prev,
        ingrids: [...(prev.ingrids || []), ingredientText],
      }));
      setIngredientText(""); // מנקה את השדה לאחר ההוספה
    }
  };

  const handleRemoveIngredient = (index) => {
    setLocalRecipe((prev) => ({
      ...prev,
      ingrids: prev.ingrids.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <label>🛒 מרכיבים</label>
      <div className="input-group">
        <input
          type="text"
          placeholder="הוסף מרכיב"
          value={ingredientText}
          onChange={(e) => setIngredientText(e.target.value)}
        />
        <FaRegSquarePlus onClick={handleAddIngredient} />
      </div>
      <ul>
        {(localRecipe.ingrids || []).map((item, index) => (
          <li key={index}>
            {item} <GiCancel className="cancel-icon" onClick={() => handleRemoveIngredient(index)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditRecipe;
