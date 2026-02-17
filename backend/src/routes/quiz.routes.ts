import { Router } from "express";
import { getNextQuestionHandler, submitAnswerHandler } from "../controllers/quiz.controller";

const router = Router();

router.post("/quiz/next", getNextQuestionHandler);
router.post("/quiz/answer", submitAnswerHandler);

export default router;
