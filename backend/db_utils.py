from pymongo import MongoClient
from typing import List, Dict
import os
from dotenv import load_dotenv

load_dotenv()


mongo_url = os.getenv("MONGO_URL")
mongo_username = os.getenv("MONGO_USERNAME")
mongo_password = os.getenv("MONGO_PASSWORD")



# MongoDB connection
MONGO_URI = f"mongodb://{mongo_username}:{mongo_password}@{mongo_url}/recipe_db?authSource=admin"
client = MongoClient(MONGO_URI)
db = client.recipe_db
recipes_collection = db.recipes

# Function to get all recipes
def get_recipes() -> List[Dict]:
    recipes = list(recipes_collection.find({}, {"_id": 0}))  # Exclude _id
    return recipes

# Function to add a recipe
def add_recipe(recipe: Dict):
    recipes_collection.insert_one(recipe)
    return {"message": "Recipe added!"}

# Function to delete a recipe by name
def delete_recipe(recipe_name: str):
    result = recipes_collection.delete_one({"name": recipe_name})
    return result

# Function to update a recipe by name
def update_recipe(recipe_name: str, updated_recipe: Dict):
    result = recipes_collection.update_one(
        {"name": recipe_name},
        {"$set": updated_recipe}
    )
    return result



