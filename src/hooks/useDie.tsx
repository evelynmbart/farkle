import { useState } from "react";
import { randDieValue } from "../utils/dice";

export function useDie(): {
  value: number;
  roll: (rollsLeft?: number) => void;
} {
  const [value, setValue] = useState(1);

  const roll = (rollsLeft: number = 10) => {
    if (rollsLeft === 0) {
      return;
    }
    setTimeout(() => {
      setValue((value) => randDieValue(value));
      roll(rollsLeft - 1);
    }, 100); // TODO: Make this slower as rollsLeft decreases
  }

  return { value, roll }
}