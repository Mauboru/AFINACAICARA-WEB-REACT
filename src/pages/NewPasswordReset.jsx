import React, { useState } from "react";
import styled from 'styled-components';
import logo from "/logomarca.png";
import { sendNewPassword } from "../services/auth";
import { CustomModal, PasswordInput, CustomButton } from "../components";
import backgroundImg from "/fundo.png";
import { useParams } from 'react-router-dom';

export default function NewPasswordReset() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      console.error("Token não encontrado!");
      return;
    }

    try {
      const response = await sendNewPassword(confirmPassword, token);
      if (response.status === 200) {
        setModal({
          show: true,
          type: "success",
          message: "Sua senha foi alterada com sucesso!.",
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
        <Styled.LeftPanel/>

        <Styled.RightPanel>
          <Styled.Logo src={logo} alt="logo" />
          <Styled.Title>Crie sua Nova Password!</Styled.Title>
          
          <form onSubmit={handleSendNewPassword}>
            <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                      />
                      
            <PasswordInput
                label="Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <hr className="my-4 border-light" />

            <CustomButton type="submit" loading={loading} disabled={!password || password != confirmPassword}>
                Enviar
            </CustomButton>
            </form>
            <CustomModal
                show={modal.show}
                type={modal.type}
                message={modal.message}
                onHide={() => setModal({ ...modal, show: false })}
            />
        </Styled.RightPanel>
      </Styled.Container>
    </Styled.ResetPage>
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

  Title: styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1.5rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
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
