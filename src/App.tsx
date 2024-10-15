import styled from "styled-components";
import { Die } from "./components/Die";
import { DieData, useDie } from "./hooks/useDie";
import { useEffect, useState } from "react";
import { calculateScore, isValidBank } from "./utils/farkle";

export default function App() {
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const die0 = useDie();
  const die1 = useDie();
  const die2 = useDie();
  const die3 = useDie();
  const die4 = useDie();
  const die5 = useDie();
  const dice = [die0, die1, die2, die3, die4, die5];
  const isDiceRolling = dice.some(die => !die.isBanked && die.isRolling);

  const rollDice = (dice: DieData[]) => {
    setIsFirstTurn(false);
    for (const die of dice) {
      die.roll();
    }
  }

  const bank = (): { diceToRoll: DieData[], bankScore: number } => {
    const diceToRoll: DieData[] = [];

    const bankingDiceValues = dice.filter(die => die.isBanking).map(die => die.value);

    // Check that there are some dice to be banked
    if (bankingDiceValues.length === 0) {
      throw new Error("You must bank some dice before you can roll again");
    }

    // Check that the banking dice are valid
    if (!isValidBank(bankingDiceValues)) {
      throw new Error("All dice to be banked must be contributing to the currentScore");
    }

    // Bank the dice
    const bankScore = calculateScore(bankingDiceValues);

    // Fully bank the dice
    // Only roll unbanked dice
    for (const die of dice) {
      if (!die.isBanked && !die.isBanking) {
        diceToRoll.push(die);
      }

      if (die.isBanking) {
        die.setIsBanking(false);
        die.setIsBanked(true);
      }
    }

    return { diceToRoll, bankScore };
  }

  const handleRollClick = () => {
    let diceToRoll: DieData[] = dice;

    if (!isFirstTurn) {
      try {
        const { diceToRoll: newDiceToRoll, bankScore } = bank();
        setCurrentScore(currentScore + bankScore);
        diceToRoll = newDiceToRoll;
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
        return;
      }
    }

    rollDice(diceToRoll);
  }

  const handleCompleteTurnClick = () => {
    let bankScore = 0;
    if (dice.some(die => die.isBanking)) {
      try {
        const { bankScore: newBankScore } = bank();
        bankScore = newBankScore;
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
    dice.forEach(die => die.reset());
    setTotalScore(totalScore + currentScore + bankScore);
    setCurrentScore(0);
    setIsFirstTurn(true);
  }

  useEffect(() => {
    if (isDiceRolling || isFirstTurn) return;

    // Check for farkle - if the unbanked dice have a currentScore of 0
    const unbankedValues = dice.filter(die => !die.isBanked).map(die => die.value);
    const unbankedScore = calculateScore(unbankedValues);
    if (unbankedScore === 0) {
      alert("Farkle!");
      // TODO: Handle farkle
    }
  }, [isDiceRolling, dice, isFirstTurn])

  const bankScore = calculateScore(dice.filter(die => die.isBanking).map(die => die.value));

  return (
    <>
      <h1>Farkle</h1>
      <Score>Total score: {totalScore}</Score>
      <Score>Current turn score: {currentScore}</Score>
      <Score>Bank score: {bankScore}</Score>
      <Container>
        {dice.map((die, index) => (
          <Die key={`die-${index}`} data={die} isFirstTurn={isFirstTurn} />
        ))}
      </Container>
      <RollButton onClick={() => handleRollClick()}>{isFirstTurn ? "Roll" : "Bank & Roll"}</RollButton>
      {!isFirstTurn && <CompleteTurnButton onClick={() => handleCompleteTurnClick()} disabled={isDiceRolling}>Complete Turn</CompleteTurnButton>}
    </>
  );
}

const Container = styled.div`
  display: flex;
  gap: 10px;
`;

const Score = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const RollButton = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #bdc3c7 !important;
    transform: none !important;
    cursor: not-allowed !important;
  }
`;

const CompleteTurnButton = styled(RollButton)`
  background-color: #27ae60;

  &:hover {
    background-color: #219a52;
  }
`;

