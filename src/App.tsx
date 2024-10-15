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
  };

  const bank = (): { diceToRoll: DieData[]; bankScore: number } => {
    const diceToRoll: DieData[] = [];

    const bankingDiceValues = dice
      .filter(die => die.isBanking)
      .map(die => die.value);

    // Check that there are some dice to be banked
    if (bankingDiceValues.length === 0) {
      throw new Error("You must bank some dice before you can roll again");
    }

    // Check that the banking dice are valid
    if (!isValidBank(bankingDiceValues)) {
      throw new Error(
        "All dice to be banked must be contributing to the currentScore"
      );
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
  };

  const handleRollClick = () => {
    let diceToRoll: DieData[] = dice;

    if (!isFirstTurn) {
      try {
        const { diceToRoll: newDiceToRoll, bankScore } = bank();
        setCurrentScore(currentScore + bankScore);
        diceToRoll = newDiceToRoll;
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
        return;
      }
    }

    // Handle hot dice -- all dice are banked, so roll them all again
    if (diceToRoll.length === 0) {
      diceToRoll = dice;
      for (const die of dice) {
        die.reset();
      }
    }

    rollDice(diceToRoll);
  };

  const handleCompleteTurnClick = () => {
    let bankScore = 0;
    if (dice.some(die => die.isBanking)) {
      try {
        const { bankScore: newBankScore } = bank();
        bankScore = newBankScore;
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
    dice.forEach(die => die.reset());
    setTotalScore(totalScore + currentScore + bankScore);
    setCurrentScore(0);
    setIsFirstTurn(true);
  };

  useEffect(
    () => {
      if (isDiceRolling || isFirstTurn) return;

      // Check for farkle - if the unbanked dice have a currentScore of 0
      const unbankedValues = dice
        .filter(die => !die.isBanked)
        .map(die => die.value);
      const unbankedScore = calculateScore(unbankedValues);
      if (unbankedScore === 0) {
        alert("Farkle!");
        // TODO: Handle farkle
      }
    },
    [isDiceRolling, dice, isFirstTurn]
  );

  const bankScore = calculateScore(
    dice.filter(die => die.isBanking).map(die => die.value)
  );

  return (
    <Container>
      <Content>
        <FarkleTitle>Farkle</FarkleTitle>
        <PlayerScores>
          <PlayerScore isCurrentPlayer={true}>
            <PlayerName isCurrentPlayer={true}>Player 1</PlayerName>
            <ScoreValue>
              {totalScore}
            </ScoreValue>
          </PlayerScore>
          <PlayerScore isCurrentPlayer={false}>
            <PlayerName isCurrentPlayer={false}>Player 2</PlayerName>
            <ScoreValue>0</ScoreValue>
          </PlayerScore>
        </PlayerScores>
        <Score>
          Turn score: {currentScore}
        </Score>
        <Score>
          Bank score: {bankScore}
        </Score>
        <DiceContainer>
          {dice.map((die, index) =>
            <Die key={`die-${index}`} data={die} isFirstTurn={isFirstTurn} />
          )}
        </DiceContainer>
        <RollButton onClick={() => handleRollClick()}>
          {isFirstTurn ? "Roll" : "Bank & Roll"}
        </RollButton>
        {!isFirstTurn &&
          <CompleteTurnButton
            onClick={() => handleCompleteTurnClick()}
            disabled={isDiceRolling}
          >
            Complete Turn
          </CompleteTurnButton>}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const FarkleTitle = styled.h1`
  font-size: 3rem;
  letter-spacing: 12px;
  font-weight: bold;
  text-align: center;
  margin: 16px 0 0;
  background: linear-gradient(45deg, #ff00cc, #3333ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: glow 1s ease-in-out infinite alternate;

  @keyframes glow {
    from {
      filter: drop-shadow(0 0 2px rgba(255, 0, 204, 0.7));
    }
    to {
      filter: drop-shadow(0 0 10px rgba(51, 51, 255, 0.7));
    }
  }
`;

const PlayerScores = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  background: linear-gradient(45deg, #ff00cc, #3333ff);
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.7);
`;

const PlayerScore =
  styled.div <
  { isCurrentPlayer: boolean } >
  `
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props =>
    props.isCurrentPlayer ? "rgba(255, 255, 255, 0.2)" : "transparent"};
  padding: 4px 24px;
  border-radius: 10px;
  box-shadow: ${props =>
    props.isCurrentPlayer ? "0 0 10px rgba(255, 255, 255, 0.5)" : "none"};
`;

const PlayerName =
  styled.div <
  { isCurrentPlayer: boolean } >
  `
  font-size: 1.3rem;
  font-weight: bold;
  color: ${props => (props.isCurrentPlayer ? "#00ffff" : "#ffd700")};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  ${props =>
    props.isCurrentPlayer &&
    `
    animation: pulse 2s infinite alternate;
    @keyframes pulse {
      from { transform: scale(1); }
      to { transform: scale(1.1); }
    }
  `}
`;

const ScoreValue = styled.div`
  font-size: 1.3rem;
  text-align: center;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  animation: pulse 3s infinite alternate;

  @keyframes pulse {
    from {
      transform: scale(1);
      color: #00ffff;
    }
    to {
      transform: scale(1.3);
      color: #00aaaa;
    }
  }
`;

const DiceContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 30px 0;
`;

const Score = styled.div`
  font-size: 1.3rem;
  text-decoration: wavy underline;
  color: #ff69b4;
  text-shadow: 1px 1px 2px #ffd700;
  transform: rotate(-2deg);
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(2deg) scale(1.05);
    color: #00ced1;
  }
`;

const RollButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  color: #00ffff;
  background-color: #ff69b4;
  border: 3px solid #ffd700;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.7);
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  transform: rotate(-2deg);

  &:hover {
    background-color: #ff1493;
    transform: rotate(2deg) scale(1.05);
    box-shadow: 0 0 20px rgba(255, 20, 147, 0.9);
  }

  &:active {
    transform: scale(0.98) rotate(-1deg);
  }

  &:disabled {
    background-color: #808080 !important;
    transform: none !important;
    cursor: not-allowed !important;
    opacity: 0.7;
  }
`;

const CompleteTurnButton = styled(RollButton)`
  background-color: #00ced1;
  border-color: #ffd700;
  transform: rotate(2deg);

  &:hover {
    background-color: #40e0d0;
    transform: rotate(-2deg) scale(1.05);
  }
`;
