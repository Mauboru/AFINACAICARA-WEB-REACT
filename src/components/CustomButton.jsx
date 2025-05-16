import styled, { keyframes } from "styled-components";
import { FaSpinner } from "react-icons/fa";

export default function CustomButton({ children, loading, ...props }) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <SpinnerIcon />
        </>
      ) : (
        children
      )}
    </Button>
  );
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #FFF;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  width: 100%;
  font-weight: bold;
  transition: background-color 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 10px;


  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;
