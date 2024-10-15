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

  const renderPips = (value: number) => {
    const pips = [];
    for (let i = 0; i < value; i++) {
      pips.push(<Pip key={i} />);
    }
    return pips;
  };

  return (
    <Container
      isFirstTurn={isFirstTurn}
      isBanked={data.isBanked}
      isBanking={data.isBanking}
      isRolling={data.isRolling}
      onClick={handleClick}
    >
      {isFirstTurn
        ? <PlaceholderText>?</PlaceholderText>
        : <PipContainer value={data.value}>
            {renderPips(data.value)}
          </PipContainer>}
    </Container>
  );
}

const Container =
  styled.button <
  {
    isFirstTurn: boolean,
    isBanked: boolean,
    isBanking: boolean,
    isRolling: boolean
  } >
  `
  width: 100px;
  height: 100px;
  border: 4px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  `}

  ${({ isBanked }) =>
    isBanked &&
    `
    border-color: green;
  `}
`;

const PlaceholderText = styled.span`
  font-size: 4rem;
  font-weight: bold;
`;

const PipContainer =
  styled.div <
  { value: number } >
  `
  width: 80%;
  height: 80%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin: 4px 0 0 4px;
  
  ${({ value }) => {
    switch (value) {
      case 1:
        return `
        display: flex;
          justify-content: center;
          align-items: center;
        `;
      case 2:
        return `
          & > :nth-child(1) { grid-area: 1 / 1; }
          & > :nth-child(2) { grid-area: 3 / 3; }
        `;
      case 3:
        return `
          & > :nth-child(1) { grid-area: 1 / 1; }
          & > :nth-child(2) { grid-area: 2 / 2; }
          & > :nth-child(3) { grid-area: 3 / 3; }
        `;
      case 4:
        return `
          & > :nth-child(1) { grid-area: 1 / 1; }
          & > :nth-child(2) { grid-area: 1 / 3; }
          & > :nth-child(3) { grid-area: 3 / 1; }
          & > :nth-child(4) { grid-area: 3 / 3; }
        `;
      case 5:
        return `
          & > :nth-child(1) { grid-area: 1 / 1; }
          & > :nth-child(2) { grid-area: 1 / 3; }
          & > :nth-child(3) { grid-area: 2 / 2; }
          & > :nth-child(4) { grid-area: 3 / 1; }
          & > :nth-child(5) { grid-area: 3 / 3; }
        `;
      case 6:
        return `
          & > :nth-child(1) { grid-area: 1 / 1; }
          & > :nth-child(2) { grid-area: 2 / 1; }
          & > :nth-child(3) { grid-area: 3 / 1; }
          & > :nth-child(4) { grid-area: 1 / 3; }
          & > :nth-child(5) { grid-area: 2 / 3; }
          & > :nth-child(6) { grid-area: 3 / 3; }
        `;
      default:
        return "";
    }
  }}
`;

const Pip = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
`;
