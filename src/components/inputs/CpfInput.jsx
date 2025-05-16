import React from "react";
import styled from "styled-components";
import { FloatingLabel, Form } from "react-bootstrap";

export default function CpfInput({ label = "CPF", name, value, onChange, required = false }) {
  const handleCpfChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length > 11) val = val.slice(0, 11);

    const formatted = val
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    onChange({ target: { name, value: formatted } });
  };

  return (
    <CpfWrapper>
      <StyledFloating as={FloatingLabel} controlId="cpfInput" label={label} className="mb-3">
        <Form.Control
          type="text"
          placeholder={label}
          value={value}
          name={name}
          onChange={handleCpfChange}
          required={required}
        />
      </StyledFloating>
    </CpfWrapper>
  );
}

const CpfWrapper = styled.div`
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
