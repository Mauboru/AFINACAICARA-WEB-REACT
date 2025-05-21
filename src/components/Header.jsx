import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useTuner } from "../context/TurnerContext";

export default function Header({ onToggleSidebar }) {
  const location = useLocation();
  const { instrument, setInstrument, note, setNote } = useTuner();
  const isTurnerPage = location.pathname.toLowerCase().startsWith("/afinador");
  const instruments = ["Rabeca", "Violino", "Machete", "Viola", "Meia-Viola"];
  const notes = ["A", "B", "C", "D", "E", "F", "G"];

  return (
    <Styled.HeaderContainer>
      <Styled.MenuButton onClick={onToggleSidebar}>
        <FaBars />
      </Styled.MenuButton>

      {isTurnerPage && (
        <>
          <Styled.Select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            {instruments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Styled.Select>

          <Styled.Select
            value={note}
            onChange={(e) => setNote(e.target.value)}
            >
            {notes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Styled.Select>
        </>
      )}
    </Styled.HeaderContainer>
  );
}

const Styled = {
  HeaderContainer: styled.header`
    height: 60px;
    width: calc(100% - 2rem);
    margin: 1rem auto;
    background-color: #1b1b1b;
    display: flex;
    gap: 30px;
    align-items: center;
    padding: 0 1.5rem;
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  `,

  MenuButton: styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    display: block;

    @media (min-width: 768px) {
      display: none;
    }
  `,

  Select: styled.select`
    background: #333;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 1rem;
  `,
};
