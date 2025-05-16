import React, { useState, useEffect  } from "react";
import logo from "/logomarca.png";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import styled from 'styled-components';
import { CustomModal, PasswordInput, CustomInput, CustomButton, CustomLink } from "../components";
import backgroundImg from "/fundo.png";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [emailCpf, setEmailCpf] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({ show: false, type: "info", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");  
    }
  }, [navigate]);
  
  const submitDataLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(emailCpf, password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      navigate("/home");
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
    <Styled.LoginPage>
      <Styled.Container>
        {/* Lado da Image */}
        <Styled.LeftPanel />

        {/* Lado do Form de Login */}
        <Styled.RightPanel>
          <Styled.Logo src={logo} alt="logo" />
          <form onSubmit={submitDataLogin}>
            <CustomInput
              label="Email ou CPF"
              name="emailCpf"
              value={emailCpf}
              onChange={(e) => setEmailCpf(e.target.value)}
              required
            />
            <PasswordInput
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <CustomLink href="/reset-password">Esqueci minha senha!</CustomLink>
            <hr className="my-4 border-light" />
            <CustomButton type="submit" loading={loading} disabled={!emailCpf || !password}>
              Login
            </CustomButton>
            <CustomLink href="/register">Não tem cadastro? Registre-se aqui!</CustomLink>
          </form>
          <CustomModal
            show={modal.show}
            type={modal.type}
            message={modal.message}
            onHide={() => setModal({ ...modal, show: false })}
          />
        </Styled.RightPanel>
      </Styled.Container>
    </Styled.LoginPage>
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

  LoginPage: styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
  `,

  Logo: styled.img`
    max-width: 225px;
    display: block;
    margin-bottom: 40px;
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
    max-width: ${(props) => props.maxWidth || '100%'};
    @media (min-width: 768px) {
      padding: 3rem 2rem;
    }
  `,
};
