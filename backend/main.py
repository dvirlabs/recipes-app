from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import db_utils  # Import database functions
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for recipe
class Recipe(BaseModel):
    name: str
    pic: str
    ingrids: Dict[str, str]  # Example: {"Sugar": "2 tsp", "Flour": "200g"}
    steps: Dict[str, str]  # Example: {"step 1": "Mix ingredients", "step 2": "Bake at 180C"}

@app.get("/recipes", response_model=List[Recipe])
async def get_recipes():
    return db_utils.get_recipes()

@app.post("/recipes")
async def add_recipe(recipe: Recipe):
    return db_utils.add_recipe(recipe.dict())


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)