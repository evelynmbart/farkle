import styled from "styled-components";
import { DieData } from "../hooks/useDie";

interface Props {
  data: DieData;
  isFirstTurn: boolean;
}

export function Die({ data, isFirstTurn }: Props) {
  const handleClick = () => {
    if (isFirstTurn) return;
    if (data.isRolling) return;
    data.setIsBanking(!data.isBanking);
  };

  // TODO: Make this a die with pips
  return (
    <Container
      isFirstTurn={isFirstTurn}
      isBanked={data.isBanked}
      isBanking={data.isBanking}
      isRolling={data.isRolling}
      onClick={handleClick}
    >
      {isFirstTurn ? "--" : data.value}
    </Container>
  );
}

const Container =
  styled.button <
  {
    isFirstTurn: boolean,
    isBanked: boolean,
    isBanking: boolean,
    isRolling: boolean,
  } >
  `
  width: 100px;
  height: 100px;
  border: 4px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  font-weight: bold;
  background: white;

  cursor: ${({ isFirstTurn, isRolling }) =>
    isFirstTurn || isRolling ? "not-allowed" : "grab"};
  &:active {
    cursor: grabbing;
  }

  ${({ isBanking }) =>
    isBanking &&
    `
    border-color: goldenrod;
    color: goldenrod;
  `}

  ${({ isBanked }) =>
    isBanked &&
    `
    border-color: green;
    color: green;
  `}
`;
