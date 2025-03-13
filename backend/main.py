from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, List
import db_utils  # Import database functions
import uvicorn
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Pydantic model for recipe
class Recipe(BaseModel):
    name: str
    pic: str
    prep_time: int  # Add preparation time field
    ingrids: List[str]
    steps: List[str]
  # Example: {"step 1": "Mix ingredients", "step 2": "Bake at 180C"}
  
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/recipes", response_model=List[Recipe])
async def get_recipes():
    return db_utils.get_recipes()

@app.post("/recipes")
async def add_recipe(recipe: Recipe):
    db_utils.add_recipe(recipe.dict())
    return {"message": "Recipe added!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    
    # שמירת הקובץ
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return JSONResponse(content={"imageUrl": f"http://localhost:8000/{file_location}"})



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)