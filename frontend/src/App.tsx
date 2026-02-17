import { useEffect, useState } from "react";

const API = "http://localhost:4000/v1";

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [question, setQuestion] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const createUser = async () => {
    const res = await fetch(`${API}/users`, { method: "POST" });
    const data = await res.json();
    setUserId(data.userId);
  };

  const getNextQuestion = async () => {
    const res = await fetch(`${API}/quiz/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setQuestion(data);
    setResult(null);
  };

  const submitAnswer = async (answer: string) => {
    const res = await fetch(`${API}/quiz/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        userId,
        questionId: question.questionId,
        answer,
      }),
    });

    const data = await res.json();
    setResult(data);
    fetchLeaderboard();
  };

  const fetchLeaderboard = async () => {
    const res = await fetch(`${API}/leaderboard`);
    const data = await res.json();
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>⚡ BrainBolt Quiz</h1>

      {!userId && (
        <button onClick={createUser}>Start Quiz</button>
      )}

      {userId && !question && (
        <button onClick={getNextQuestion}>Get Question</button>
      )}

      {question && (
        <div>
          <h2>{question.prompt}</h2>
          {question.choices.map((c: string) => (
            <button
              key={c}
              onClick={() => submitAnswer(c)}
              style={{ display: "block", margin: "10px 0" }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div>
          <h3>
            {result.correct ? "✅ Correct!" : "❌ Wrong!"}
          </h3>
          <p>Next Difficulty: {result.nextDifficulty}</p>
          <button onClick={getNextQuestion}>Next Question</button>
        </div>
      )}

      <hr />

      <h2>🏆 Leaderboard</h2>
      {leaderboard.map((u, i) => (
        <div key={u.userId}>
          {i + 1}. {u.userId.slice(0, 6)} — {u.score}
        </div>
      ))}
    </div>
  );
}

export default App;
