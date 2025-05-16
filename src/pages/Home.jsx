import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";

export default function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            const defaultUser = { name: "Visitante", role: "visitor" };
            setUser(defaultUser);
            localStorage.setItem("userData", JSON.stringify({ user: defaultUser }));
        }
    }, []);

    if (!user) {
        return (
            <MainLayout>
                <p>Carregando...</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Styled.ContentWrapper>
                <Styled.MainTitle>Bem-vindo, {user.name}!</Styled.MainTitle>
                <Styled.InfoText>Este é um ambiente de demonstração.</Styled.InfoText>
                <Styled.InfoText>Para solicitar acesso completo, entre em contato com o administrador.</Styled.InfoText>
            </Styled.ContentWrapper>
        </MainLayout>
    );
}

const Styled = {
    ContentWrapper: styled.section`
        text-align: center;
        margin-top: 2rem;
        color: #e0e0e0;
    `,

    MainTitle: styled.h1`
        font-size: 2rem;
        color:rgb(0, 0, 0);
        margin-bottom: 1.5rem;
    `,

    InfoText: styled.p`
        color:rgb(0, 0, 0);
        font-size: 1.1rem;
        margin: 0.5rem 0;
    `,
};