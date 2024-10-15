import styled from "styled-components";
import { Die } from "./components/Die";
import { DieData, useDie } from "./hooks/useDie";
import { useEffect, useState } from "react";
import { calculateScore, isFarkle, isValidBank } from "./utils/farkle";

export default function App() {
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [score, setScore] = useState(0);

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

  const handleRollClick = () => {
    let diceToRoll: DieData[] = dice;

    if (!isFirstTurn) {
      const bankingDiceValues = dice.filter(die => die.isBanking).map(die => die.value);

      // Check that there are some dice to be banked
      if (bankingDiceValues.length === 0) {
        alert("You must bank some dice before you can roll again");
        return;
      }

      // Check that the banking dice are valid
      if (!isValidBank(bankingDiceValues)) {
        alert("All dice to be banked must be contributing to the score");
        return;
      }

      // Bank the dice
      const bankingDiceScore = calculateScore(bankingDiceValues);
      setScore(score + bankingDiceScore);

      // Fully bank the dice
      // Only roll unbanked dice
      diceToRoll = [];
      for (const die of dice) {
        if (!die.isBanked && !die.isBanking) {
          diceToRoll.push(die);
        }

        if (die.isBanking) {
          die.setIsBanking(false);
          die.setIsBanked(true);
        }
      }
    }

    rollDice(diceToRoll);
  }

  useEffect(() => {
    if (isDiceRolling) return;

    // Check for farkle - if the unbanked dice have a score of 0
    const unbankedValues = dice.filter(die => !die.isBanked).map(die => die.value);
    if (isFarkle(unbankedValues)) {
      alert("Farkle!");
      // TODO: Handle farkle
    }
  }, [isDiceRolling, dice])

  return (
    <>
      <h1>Farkle</h1>
      <Score>Score: {score}</Score>
      <Container>
        {dice.map((die, index) => (
          <Die key={`die-${index}`} data={die} isFirstTurn={isFirstTurn} />
        ))}
      </Container>
      <RollButton onClick={() => handleRollClick()}>{isFirstTurn ? "Roll" : "Bank & Roll"}</RollButton>
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
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffffff;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  border-radius: 50px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(45deg, #ff8787, #ffd571);
  }
`;
