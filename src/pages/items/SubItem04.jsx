import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";

export default function SubItem04() {
  return (
    <MainLayout>
      <Styled.Container>
        <Styled.Title>Sample Page - SubItem 04 (essa página é privada, apenas moderadores)</Styled.Title>
        <Styled.Subtitle>Exemplo de layout com texto e cards</Styled.Subtitle>

        <Styled.SectionTitle>Recursos Disponíveis</Styled.SectionTitle>
        <Styled.Cards>
          <Styled.Card>
            <Styled.CardTitle>Componente Reutilizável</Styled.CardTitle>
            <Styled.CardText>Exemplo de componente que pode ser usado em várias telas.</Styled.CardText>
          </Styled.Card>

          <Styled.Card>
            <Styled.CardTitle>Estilização Modular</Styled.CardTitle>
            <Styled.CardText>Uso de styled-components para isolar e reutilizar estilos.</Styled.CardText>
          </Styled.Card>

          <Styled.Card>
            <Styled.CardTitle>Responsividade</Styled.CardTitle>
            <Styled.CardText>Fácil adaptação do layout para diferentes tamanhos de tela.</Styled.CardText>
          </Styled.Card>
        </Styled.Cards>
      </Styled.Container>
    </MainLayout>
  );
}

const Styled = {
  Container: styled.div`
    padding: 2rem;
  `,

  Title: styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 0.5rem;
  `,

  Subtitle: styled.h2`
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
  `,

  SectionTitle: styled.h3`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
  `,

  Cards: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  `,

  Card: styled.div`
    flex: 1 1 300px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `,

  CardTitle: styled.h4`
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  `,

  CardText: styled.p`
    font-size: 0.95rem;
    color: #555;
  `,
};
