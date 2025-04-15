db = db.getSiblingDB('recipes_db');

db.createUser({
  user: "recipes_user",
  pwd: "Aa123456",
  roles: [
    {
      role: "readWrite",
      db: "recipes_db"
    }
  ]
});
