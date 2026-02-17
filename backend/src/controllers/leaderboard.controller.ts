import { Request, Response } from "express";
import { redis } from "../config/redis";

export async function getLeaderboardHandler(req: Request, res: Response) {
  try {
    const topUsers = await redis.zrevrange(
      "leaderboard",
      0,
      9,
      "WITHSCORES"
    );

    const result = [];

    for (let i = 0; i < topUsers.length; i += 2) {
      result.push({
        userId: topUsers[i],
        score: Number(topUsers[i + 1]),
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
