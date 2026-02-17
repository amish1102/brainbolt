import { Router } from "express";
import { getLeaderboardHandler } from "../controllers/leaderboard.controller";

const router = Router();

router.get("/leaderboard", getLeaderboardHandler);

export default router;
