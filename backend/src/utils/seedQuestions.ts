import { pool } from "../config/db";
import { createHash } from "crypto";

function hashAnswer(answer: string) {
  return createHash("sha256").update(answer).digest("hex");
}

export async function seedQuestions() {
  const questions = [
    {
      difficulty: 3,
      prompt: "What is 2 + 2?",
      choices: ["3", "4", "5", "6"],
      correct: "4",
    },
    {
      difficulty: 5,
      prompt: "What is the capital of France?",
      choices: ["Berlin", "Paris", "Rome", "Madrid"],
      correct: "Paris",
    },
    {
      difficulty: 7,
      prompt: "What is the derivative of x^2?",
      choices: ["x", "2x", "x^2", "2"],
      correct: "2x",
    },
    {
      difficulty: 9,
      prompt: "Solve: lim x→0 (sin x)/x",
      choices: ["0", "1", "Undefined", "Infinity"],
      correct: "1",
    },
  ];

  for (const q of questions) {
    await pool.query(
      `
      INSERT INTO questions (difficulty, prompt, choices, correct_answer_hash)
      VALUES ($1, $2, $3, $4)
      `,
      [
        q.difficulty,
        q.prompt,
        JSON.stringify(q.choices),
        hashAnswer(q.correct),
      ]
    );
  }

  console.log("Questions seeded successfully");
}
