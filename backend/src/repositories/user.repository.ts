import { pool } from "../config/db";

export async function createUser() {
  const result = await pool.query(
    "INSERT INTO users DEFAULT VALUES RETURNING id"
  );

  const userId = result.rows[0].id;

  await pool.query(
    `INSERT INTO user_state (user_id) VALUES ($1)`,
    [userId]
  );

  return userId;
}
