import styled from "styled-components";
import MainLayout from '../layouts/MainLayout';

export default function Sheets() {
  return (
    <MainLayout>
      <Styled.Page>
          Pagina de Sheets
      </Styled.Page>
    </MainLayout>
  );
}

const Styled = {
  Page: styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    font-family: Arial, sans-serif;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,
};
