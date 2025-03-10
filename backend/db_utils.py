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

