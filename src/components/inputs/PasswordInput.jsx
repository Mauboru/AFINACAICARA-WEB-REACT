import React, { useState } from "react";
import styled from "styled-components";
import { FloatingLabel, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({ label = "Senha", name, value, onChange, required = false }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <PasswordWrapper>
      <StyledFloating as={FloatingLabel} controlId="passwordInput" label={label} className="mb-3">
        <Form.Control
          type={mostrarSenha ? "text" : "password"}
          placeholder={label}
          value={value}
          name={name}
          onChange={onChange}
          required={required}
        />
      </StyledFloating>
      <ToggleButton type="button" onClick={() => setMostrarSenha(prev => !prev)}>
        {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
      </ToggleButton>
    </PasswordWrapper>
  );
}

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledFloating = styled.div`
  .form-control {
    background-color: ${({ theme }) => theme.colors.inputBg};
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    color: ${({ theme }) => theme.colors.text};
    padding: 0.8rem 0.75rem;
    border-radius: 4px;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: none;
    }
  }

  label {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  .form-control:focus ~ label {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
