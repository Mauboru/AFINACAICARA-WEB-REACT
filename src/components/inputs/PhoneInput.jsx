import React from "react";
import styled from "styled-components";
import { FloatingLabel, Form } from "react-bootstrap";

export default function PhoneInput({ label = "Telefone", name, value, onChange, required = false }) {
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length > 11) val = val.slice(0, 11);

    const formatted = val
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");

    onChange({ target: { name, value: formatted } });
  };

  return (
    <PhoneWrapper>
      <StyledFloating as={FloatingLabel} controlId="phoneInput" label={label} className="mb-3">
        <Form.Control
          type="tel"
          placeholder={label}
          value={value}
          name={name}
          onChange={handlePhoneChange}
          required={required}
        />
      </StyledFloating>
    </PhoneWrapper>
  );
}

const PhoneWrapper = styled.div`
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
