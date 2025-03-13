from pymongo import MongoClient
from typing import List, Dict

# MongoDB connection
MONGO_URI = "mongodb://admin:Aa123456@192.168.10.109:27017/"
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



