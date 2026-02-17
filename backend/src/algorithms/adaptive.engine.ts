export function calculateNextDifficulty(
  currentDifficulty: number,
  isCorrect: boolean
) {
  if (isCorrect) {
    return Math.min(10, currentDifficulty + 1);
  } else {
    return Math.max(1, currentDifficulty - 1);
  }
}

export function calculateScore(difficulty: number, isCorrect: boolean) {
  if (!isCorrect) return 0;

  return difficulty * 10;
}
