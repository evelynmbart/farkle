import { useState } from "react";
import { randDieValue } from "../utils/dice";

export interface DieData {
  value: number;
  roll: (rollsLeft?: number) => void;
  isBanked: boolean;
  setIsBanked: (isBanked: boolean) => void;
  isBanking: boolean;
  setIsBanking: (isBanking: boolean) => void;
  isRolling: boolean;
}

export function useDie(): DieData {
  const [value, setValue] = useState(1);
  const [isBanked, setIsBanked] = useState(false);
  const [isBanking, setIsBanking] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const roll = (rollsLeft: number = 10) => {
    if (rollsLeft === 0) {
      setIsRolling(false);
      return;
    }
    setIsRolling(true);
    setValue(value => randDieValue(value));
    setTimeout(() => {
      roll(rollsLeft - 1);
    }, 100); // TODO: Make this slower as rollsLeft decreases
  };

  return {
    value,
    roll,
    isBanked,
    setIsBanked,
    isBanking,
    setIsBanking,
    isRolling,
  };
}
