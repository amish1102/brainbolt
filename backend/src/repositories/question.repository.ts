import { pool } from "../config/db";

export async function getQuestionByDifficulty(difficulty: number) {
  const result = await pool.query(
    `
    SELECT id, difficulty, prompt, choices
    FROM questions
    WHERE difficulty = $1
    ORDER BY RANDOM()
    LIMIT 1
    `,
    [difficulty]
  );

  return result.rows[0] || null;
}

export async function getQuestionWithAnswer(questionId: string) {
  const result = await pool.query(
    `
    SELECT *
    FROM questions
    WHERE id = $1
    `,
    [questionId]
  );

  return result.rows[0] || null;
}