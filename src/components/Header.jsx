import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "/user.png";
import { FaBars } from "react-icons/fa";
import Switch from '@mui/material/Switch';

export default function Header({ onToggleSidebar }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const [switchState, setSwitchState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    setUser(storedUser);
    setProfileImage(storedUser.image ? `${import.meta.env.VITE_BASE_URL_PROFILE}/${storedUser.image}` : null);
    setSwitchState(storedUser.role === "manager");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleSwitchChange = (event) => {
    const newRole = event.target.checked ? "manager" : "user";
    const updatedUser = { ...user, role: newRole };
    localStorage.setItem("userData", JSON.stringify(updatedUser)); 
    setSwitchState(event.target.checked);
    setUser(updatedUser);
    window.location.reload();
  };

  return (
    <Styled.HeaderContainer>
      <Styled.MenuButton onClick={onToggleSidebar}>
        <FaBars />
      </Styled.MenuButton>

      <Switch 
        {...label} 
        color="primary" 
        checked={switchState}
        onChange={handleSwitchChange}
      />
      <Styled.Text>{switchState ? "Manager" : "User"}</Styled.Text>

      <Styled.UserInfo>
        <Styled.UserName>{user?.name || "Convidado"}</Styled.UserName>
        <Styled.UserButton onClick={toggleMenu}>
          <img src={profileImage || defaultUserImg} alt="Usuário" />
        </Styled.UserButton>
        {isMenuOpen && (
          <Styled.UserMenu>
            <Styled.MenuItem>{user?.email || "email@convidado.com"}</Styled.MenuItem>
            <Styled.MenuItem onClick={() => navigate("/profile")}>Editar Perfil</Styled.MenuItem>
            <Styled.MenuItem onClick={handleLogout}>Logout</Styled.MenuItem>
          </Styled.UserMenu>
        )}
      </Styled.UserInfo>

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

  Text: styled.div`
    position: relative;
    display: flex;
  `,

  UserInfo: styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-left: auto;
  `,

  UserName: styled.span`
    margin-right: 0.8rem;
    font-weight: 500;
    font-size: 1rem;
    color: #fff;
  `,

  UserButton: styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
  `,

  UserMenu: styled.div`
    position: absolute;
    top: 50px;
    right: 0;
    background: #2a2a2a;
    border-radius: 8px;
    padding: 0.5rem 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 10;
    min-width: 160px;
  `,

  MenuItem: styled.div`
    padding: 0.75rem 1.2rem;
    color: white;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #3a3a3a;
    }
  `,
};
