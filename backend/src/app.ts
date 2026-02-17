import express from "express";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import quizRoutes from "./routes/quiz.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/v1", leaderboardRoutes);

app.use("/v1", userRoutes);
app.use("/v1", quizRoutes);

app.get("/", (req, res) => {
  res.send("BrainBolt Backend Running");
});
