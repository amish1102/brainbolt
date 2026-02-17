import { pool } from "../config/db";

export async function getUserState(userId: string) {
  const result = await pool.query(
    `SELECT * FROM user_state WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}

