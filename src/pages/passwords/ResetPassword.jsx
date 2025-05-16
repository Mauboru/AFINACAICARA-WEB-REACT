import React, { useState } from "react";
import logo from "/logomarca.png";
import { sendEmailReset } from "../../services/auth";
import styled from 'styled-components';
import { CustomModal, CustomInput, CustomButton, CustomLink } from "../../components";
import backgroundImg from "/fundo.png";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });

  const sendEmailPasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await sendEmailReset(email);

      if (response.status === 201) {
        setModal({
          show: true,
          type: "success",
          message: "Email enviado com sucesso! Verifique sua caixa de entrada.",
        });
      }
    } catch (error) {
      const mensagemErro = error?.response?.data?.message || "Erro ao conectar com o servidor.";
      setModal({
        show: true,
        type: "error",
        message: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styled.ResetPage>
      <Styled.Container>
        {/* Lado da Image */}
        <Styled.LeftPanel />

        <Styled.RightPanel>
          <Styled.Logo src={logo} alt="logo" />

          <form onSubmit={sendEmailPasswordReset}>
            <CustomInput
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <hr className="my-4 border-light" />

            <CustomButton type="submit" loading={loading} disabled={!email}>
            Enviar
            </CustomButton>

            <CustomLink href="/">Voltar para o Login!</CustomLink>
            </form>
            <CustomModal
                show={modal.show}
                type={modal.type}
                message={modal.message}
                onHide={() => setModal({ ...modal, show: false })}
            />
        </Styled.RightPanel>
      </Styled.Container>
    </Styled.ResetPage >
  );
}

const Styled = {
  Container: styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    flex-direction: row;
  `,

  Logo: styled.img`
    max-width: 265px;
    display: block;
    margin: 0 auto 1rem auto;
  `,

  ResetPage: styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  `,

  LeftPanel: styled.div`
    flex: 2.8;
    position: relative;
    height: 100%;
    overflow: hidden;
    background-image: url(${backgroundImg});
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;

    @media (max-width: 767px) {
      display: none;
    }
  `,

  RightPanel: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primaryDarkTwo};
    padding: 2rem 1rem;
    height: 100%;

    @media (min-width: 768px) {
      max-width: 600px;
      padding: 3rem 2rem;
    }
  `,
};