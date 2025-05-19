import styled from "styled-components";
import { FaBars } from "react-icons/fa";

export default function Header({ onToggleSidebar }) {

  return (
    <Styled.HeaderContainer>
      <Styled.MenuButton onClick={onToggleSidebar}>
        <FaBars />
      </Styled.MenuButton>
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
    justify-content: space-between;
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
};
