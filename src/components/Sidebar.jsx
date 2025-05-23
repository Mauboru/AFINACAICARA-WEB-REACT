import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import LogoImage from "/logomarca.png";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import menu from '../utils/menu'

export default function Sidebar({ isOpen, onClose }) {
  const theme = useTheme();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const currentPath = location.pathname;

  useEffect(() => {
    setMenuItems(menu);
    const activeMenu = menu.find(item =>
      item.subItems?.some(sub => sub.path === currentPath)
    );
    if (activeMenu) {
      setExpandedMenu(activeMenu.path);
    }
  }, [currentPath]);

  const toggleMenu = (menuPath) => {
    setExpandedMenu(prev => (prev === menuPath ? null : menuPath));
  };

  return (
    <>
      <Styled.Overlay onClick={onClose} $isOpen={isOpen} $bgColor={theme.primary} />
      <Styled.SidebarContainer $isOpen={isOpen}>
        <Styled.LogoWrapper>
          <a href="/">
            <img src={LogoImage} alt="Logo" />
          </a>
        </Styled.LogoWrapper>
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentPath.startsWith(item.path);

            return (
              <div key={item.path}>
                {item.subItems ? (
                  <Styled.NavItem selected={isSelected} onClick={() => toggleMenu(item.path)}>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {Icon && <Icon style={{ marginRight: 8 }} />}
                        {item.label}
                      </span>
                      {expandedMenu === item.path ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                    </span>
                  </Styled.NavItem>
                ) : (
                  <Link
                    to={item.path}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Styled.NavItem selected={isSelected}>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {Icon && <Icon style={{ marginRight: 8 }} />}
                        {item.label}
                      </span>
                    </Styled.NavItem>
                  </Link>
                )}

                {item.subItems && expandedMenu === item.path && (
                  item.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <Styled.SubItem key={sub.path} selected={currentPath === sub.path}>
                        <Link to={sub.path}>
                          {SubIcon && <SubIcon style={{ marginRight: 8 }} />}
                          {sub.label}
                        </Link>
                      </Styled.SubItem>
                    );
                  })
                )}
              </div>
            );
          })}
        </ul>
        <Styled.Footer>
          <p>Realização:</p>
          <div className="footer-logos">
            <img className="img1" src="/tecnomaub.png" alt="Logo 1" />
          </div>
        </Styled.Footer>
      </Styled.SidebarContainer>
    </>
  );
}

const Styled = {
  SidebarContainer: styled.aside`
    width: 240px;
    height: 100vh;
    background-color: #111;
    color: white;
    padding: 1rem;
    position: fixed;
    top: 0;
    left: ${({ $isOpen }) => ($isOpen ? "0" : "-260px")};
    transition: left 0.3s ease;
    z-index: 1001;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);

    display: flex;
    flex-direction: column;

    ul {
      list-style: none;
      padding: 0;
    }

    @media (min-width: 768px) {
      position: relative;
      left: 0;
      z-index: auto;
    }
  `,

  Footer: styled.div`
    margin-top: auto;
    padding: 16px;
    font-size: 12px;
    color: #999;
    text-align: center;

    .footer-logos {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 4px;

      .img1 {
        height: 74px;
      }

      .img2 {
        height: 74px;
      }
    }
  `,

  NavItem: styled.li`
    margin: 1rem 0;
    font-weight: bold;
    border-radius: 8px;
    background-color: ${({ selected, theme }) => selected ? theme.colors.primary : "transparent"};
    padding: 0.5rem 1rem;
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
      background-color: ${({ selected }) => !selected && "#1a1a1a"};
    }
  `,

  LogoWrapper: styled.div`
    text-align: center;
    margin-bottom: 2rem;

    img {
      max-width: 175px;
      height: auto;
    }
  `,

  Overlay: styled.div`
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $bgColor }) => $bgColor || "rgba(0, 0, 0, 0.4)"};
    z-index: 1000;

    @media (min-width: 768px) {
      display: none;
    }
  `,
};
