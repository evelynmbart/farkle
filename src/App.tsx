import styled from "styled-components";
import { Die } from "./components/Die";
import { useDie } from "./hooks/useDie";

export default function App() {
  const die0 = useDie();
  const die1 = useDie();
  const die2 = useDie();
  const die3 = useDie();
  const die4 = useDie();
  const die5 = useDie();

  const rollAll = () => {
    die0.roll();
    die1.roll();
    die2.roll();
    die3.roll();
    die4.roll();
    die5.roll();
  }

  return (
    <>
      <h1>Farkle</h1>
      <Container>
        <Die value={die0.value} />
        <Die value={die1.value} />
        <Die value={die2.value} />
        <Die value={die3.value} />
        <Die value={die4.value} />
        <Die value={die5.value} />
      </Container>
      <button onClick={() => rollAll()}>Roll</button>
    </>
  );
}

const Container = styled.div`
  display: flex;
  gap: 10px;
`;
