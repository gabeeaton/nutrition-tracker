import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

//ROUTES//

//SIGN UP(INSERT SETTINGS)
app.post("/sign-up", async(req, res) => {
  try{
    const {firebase_id, email, calories_goal, protein_goal, fat_goal, carbs_goal} = req.body;

    console.log(firebase_id, email, calories_goal, protein_goal, fat_goal, carbs_goal);

    if (!firebase_id || !email) {
      return res.status(400).json({error: "Must have id and email. "})
    }
    const defaultSettings = await pool.query(
      `INSERT INTO settings (firebase_id, email, calorie_goal, protein_goal, carb_goal, fat_goal) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
       [firebase_id, email, calories_goal, protein_goal, fat_goal, carbs_goal]
    );

  } catch(err) {
    console.error(err);
  }
})

//POST food
app.post("/log-food", async(req, res) => {
  try{
    const {user, email, name, calories, protein, carbs, fat, servingType, serving_size} = req.body;

    if( !servingType || !serving_size ) {
      return res.status(400).json({error: "All fields are requried."})
    }

    console.log(user, email, name, calories, protein, carbs, fat, servingType, serving_size );
    const newEntry = await pool.query(
      `INSERT INTO entries (firebase_id, email, food_name, calories, protein, carbs, fats, serving_type, servings) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *;`, 
      [user, email, name, calories, protein, carbs, fat, servingType, serving_size]
  );
  }
  catch(err) {
    console.error(err);
  }
})

//GET entries
app.get("/entries/:firebaseid/:date", async (req, res) => {
  const { firebaseid, date } = req.params; 
  try {
    const result = await pool.query(`SELECT * FROM entries WHERE firebase_id = $1 AND created_at::date = $2`, [firebaseid, date]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching entries." })
  }
});


//EDIT Food

//REMOVE food

// GET settings

// POST settings

// EDIT settings
app.put("/settings", async(req, res) => {
  const { firebase_id, email, calorie_goal, protein_goal, fat_goal, carbs_goal} = req.body;
  try{
    const updatedSettings = await pool.query(`UPDATE settings 
    SET email = COALESCE($2, email),
        calorie_goal = COALESCE($3, calories_goal),
        protein_goal = COALESCE($4, protein_goal),
        fat_goal = COALESCE($5, fat_goal),
        carbs_goal = COALESCE($6, carbs_goal)
    WHERE firebase_id = $1
    RETURNING *;
  `, [firebase_id, email, calorie_goal, protein_goal, fat_goal, carbs_goal]);
  } catch(error) {
    console.error(error);
  }

})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});