export function calculateScore(dice: number[]) {
  // Count occurrences of each die value
  const counts = new Array(7).fill(0);
  for (const die of dice) {
    counts[die]++;
  }

  let score = 0;

  /**
   * Cases that use all of the dice
   */

  // If all the same number, return 3000
  if (counts.some(count => count === 6)) {
    return 3000;
  }

  // If 2 triplets, return 2500
  if (counts.filter(count => count === 3).length === 2) {
    return 2500;
  }

  // If 3 pairs, return 1500
  if (counts.filter(count => count === 2).length === 3) {
    return 1500;
  }

  // If 1-6 straight, return 1500
  if (counts.filter(count => count === 1).length === 6) {
    return 1500;
  }

  // If 4 of any number with a pair, return 1500
  if (
    counts.filter(count => count === 4).length === 1 &&
    counts.filter(count => count === 2).length === 1
  ) {
    return 1500;
  }

  /**
   * Cases that only use some of the dice
   */

  // If 5 of any number, add 2000
  if (counts.filter(count => count === 5).length === 1) {
    score += 2000;
    counts[counts.indexOf(5)] = 0;
  }

  // If 4 of any number, add 1000
  if (counts.filter(count => count === 4).length === 1) {
    score += 1000;
    counts[counts.indexOf(4)] = 0;
  }

  // If 3 of any number, add that number * 100 (except triple 1 is 300)
  if (counts.filter(count => count === 3).length === 1) {
    const index = counts.indexOf(3);
    score += index === 1 ? 300 : index * 100;
    counts[counts.indexOf(3)] = 0;
  }

  // Add 100 for each 1
  score += counts[1] * 100;

  // Add 50 for each 5
  score += counts[5] * 50;

  return score;
}

export function isFarkle(dice: number[]) {
  return calculateScore(dice) === 0;
}

export function isValidBank(dice: number[]) {
  // If any of the dice can be removed and the score is the same, return false
  const score = calculateScore(dice);
  for (let i = 0; i < dice.length; i++) {
    const newDice = dice.filter((_, index) => index !== i);
    if (calculateScore(newDice) === score) {
      return false;
    }
  }
  return true;
}