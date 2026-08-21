export function parseTargetReps(reps: string): number {
  const match = reps.match(/\d+/g);
  if (!match || match.length === 0) return 10;
  return Number(match[match.length - 1]);
}
