import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";

export default function MainLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Wrapper>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Main>
                <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
                <Content>{children}</Content>
            </Main>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  background-color: #f2f2f2;
  padding: 2rem;
  overflow-y: auto;
  height: 100%;
`;
