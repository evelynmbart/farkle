import styled from "styled-components";

interface Props {
  value: number;
}

export function Die({ value }: Props) {
  // TODO: Make this a die with pips
  return <Container>{value}</Container>
}

const Container = styled.div`
  width: 100px;
  height: 100px;
  border: 4px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  font-weight: bold;
`;
