import { Request, Response } from "express";
import { getUserState } from "../repositories/userState.repository";
import { getQuestionByDifficulty } from "../repositories/question.repository";

export async function getNextQuestionHandler(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const userState = await getUserState(userId);

    if (!userState) {
      return res.status(404).json({ error: "User not found" });
    }

    const question = await getQuestionByDifficulty(
      userState.current_difficulty
    );

    if (!question) {
      return res.status(404).json({ error: "No question found" });
    }

    res.json({
      questionId: question.id,
      difficulty: question.difficulty,
      prompt: question.prompt,
      choices: question.choices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch question" });
  }
}


import { pool } from "../config/db";
import { createHash } from "crypto";
import { getQuestionWithAnswer } from "../repositories/question.repository";
import { calculateNextDifficulty, calculateScore } from "../algorithms/adaptive.engine";

export async function submitAnswerHandler(req: Request, res: Response) {
  const client = await pool.connect();

  try {
    const { userId, questionId, answer } = req.body;

    if (!userId || !questionId || !answer) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await client.query("BEGIN");

    const question = await getQuestionWithAnswer(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const hashedAnswer = createHash("sha256")
      .update(answer)
      .digest("hex");

    const isCorrect = hashedAnswer === question.correct_answer_hash;

    const userStateResult = await client.query(
      `SELECT * FROM user_state WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    const userState = userStateResult.rows[0];

    const nextDifficulty = calculateNextDifficulty(
      userState.current_difficulty,
      isCorrect
    );

    const scoreDelta = calculateScore(
      userState.current_difficulty,
      isCorrect
    );

    const newStreak = isCorrect ? userState.streak + 1 : 0;

    await client.query(
      `
      UPDATE user_state
      SET current_difficulty = $1,
          streak = $2,
          total_score = total_score + $3,
          total_attempts = total_attempts + 1,
          correct_count = correct_count + $4
      WHERE user_id = $5
      `,
      [
        nextDifficulty,
        newStreak,
        scoreDelta,
        isCorrect ? 1 : 0,
        userId,
      ]
    );

    await client.query(
      `
      INSERT INTO answer_log
      (id, user_id, question_id, difficulty, answer, correct, score_delta, streak_at_answer)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
      `,
      [
        userId,
        questionId,
        question.difficulty,
        answer,
        isCorrect,
        scoreDelta,
        newStreak,
      ]
    );

    await client.query("COMMIT");

    res.json({
      correct: isCorrect,
      scoreDelta,
      nextDifficulty,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Answer submission failed" });
  } finally {
    client.release();
  }
}
