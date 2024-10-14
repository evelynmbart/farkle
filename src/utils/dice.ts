// Returns a random value from 1 to 6, inclusive
export function randDieValue(exclude: number | null): number {
  const value = Math.floor(Math.random() * 6) + 1;
  if (value === exclude) {
    return randDieValue(exclude);
  }
  return value;
}