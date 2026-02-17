import dotenv from "dotenv";
import { app } from "./app";
import { pool } from "./config/db";
import "./config/redis";
import { seedQuestions } from "./utils/seedQuestions";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");

    await seedQuestions(); // 👈 add this

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
}

start();
