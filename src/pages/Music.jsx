import styled from "styled-components";
import MainLayout from "../layouts/MainLayout";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSpotify, FaYoutube, FaSoundcloud } from "react-icons/fa";

export default function Music() {
    const [musicList, setMusicList] = useState([]);
    const [music, setMusic] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const musics = [
            { id: 1, title: "Feliz", author: "João Silva", album: "Alegria", year: 2015, band: "Os Bons", letter: "Feliz é quem canta com o coração,\nVive a vida com emoção..." },
            { id: 2, title: "Marinheiro", author: "Lucas Rocha", album: "Águas", year: 2018, band: "Maré Alta", letter: "O marinheiro saiu no mar,\nCom saudade no olhar..." },
            { id: 3, title: "Queromana", author: "Ana Reis", album: "Desejos", year: 2017, band: "Flor do Cerrado", letter: "Queromana dança no vento,\nLeve feito pensamento..." },
            { id: 4, title: "No Jardim", author: "Carlos Luz", album: "Natureza", year: 2016, band: "Raízes", letter: "No jardim da esperança,\nPlantei o meu amor..." },
            { id: 5, title: "Peixe Morto", author: "Marina Costa", album: "Profundezas", year: 2019, band: "Oceano Seco", letter: "O peixe morto não nada,\nMas sua história ainda fala..." },
            {
                id: 6,
                title: "Menina você tá lembrada",
                author: "Desconhecido",
                album: "Chamarritas Gaúchas",
                year: 2023,
                band: "Grupo Manema",
                spotify: "https://open.spotify.com/track/abc123",
                youtube: "https://youtube.com/watch?v=abc123",
                soundcloud: "",
                letter: `
            Ai no meio desse salão
            Ai ??? o bateu asa
            
            Menina você tá lembrada
            Ai daquela tarde serena
            Que eu passei no seu ranchinho
            Como que vai, cumprimentei
            Todo bonzinho, minha donzela, meu amorzinho
            
            Aí nós temos obrigação
            Pra saudar o dono da casa
            
            (REFRÃO)

            Ai capinzinho do terreiro
            Ai não contei que há de vim
            
            (REFRÃO)

            Ai não quero que meu bem saiba
            Aí nova noite se admira
            
            (REFRÃO)

            Ai meu amigo e camarada
            Ai vamo dar por despedida
            
            (REFRÃO)

            Ai no meu bairro não se usa
            Ai vem fazer moda cumprida`
            },            
            { id: 7, title: "Menina do cabelo comprido", author: "Patrícia Moraes", album: "Sonhos", year: 2021, band: "Horizonte Azul", letter: "Menina do cabelo comprido,\nTeu riso é o meu abrigo..." },
            { id: 8, title: "Tamanduá no Baile", author: "Rafael Souza", album: "Selva Urbana", year: 2022, band: "Bicho Solto", letter: "Tamanduá no baile chegou,\nTodo mundo se espantou..." },
        ];

        musics.sort((a, b) => a.title.localeCompare(b.title));
        setMusicList(musics);

        const found = musics.find((m) => m.id === Number(id));
        setMusic(found);
    }, [id]);

    return (
        <MainLayout>
            {music ? (
                <Styled.Container>
                    <Styled.Header>
                        <Styled.Title>{music.title}</Styled.Title>
                        <Styled.Icons>
                            {music.spotify && (
                                <a href={music.spotify} target="_blank" rel="noopener noreferrer">
                                    <FaSpotify size={24} color="#1DB954" />
                                </a>
                            )}
                            {music.youtube && (
                                <a href={music.youtube} target="_blank" rel="noopener noreferrer">
                                    <FaYoutube size={24} color="#FF0000" />
                                </a>
                            )}
                            {music.soundcloud && (
                                <a href={music.soundcloud} target="_blank" rel="noopener noreferrer">
                                    <FaSoundcloud size={24} color="#FF5500" />
                                </a>
                            )}
                        </Styled.Icons>
                    </Styled.Header>
                    <Styled.Info><strong>Autor:</strong> {music.author}</Styled.Info>
                    <Styled.Info><strong>Álbum:</strong> {music.album}</Styled.Info>
                    <Styled.Info><strong>Ano:</strong> {music.year}</Styled.Info>
                    <Styled.Info><strong>Banda:</strong> {music.band}</Styled.Info>
                    <Styled.Lyrics>{music.letter}</Styled.Lyrics>
                </Styled.Container>
            ) : (
                <Styled.Aviso>Música não encontrada.</Styled.Aviso>
            )}
        </MainLayout>
    );
}

const Styled = {
    Container: styled.div`
        padding: 1.5rem;
        background-color: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 0 8px rgba(0,0,0,0.1);
    `,
    
    Title: styled.h2`
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
    `,

    Info: styled.p`
        margin: 0.25rem 0;
        font-size: 1rem;
    `,

    Lyrics: styled.div`
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #ddd;
        white-space: pre-wrap;
        line-height: 1.5;
        font-size: 1rem;
        word-break: break-word;
        text-indent: 1.5rem

        @media (max-width: 600px) {
            font-size: 0.95rem;
            text-indent: 1rem;
        }
    `,

    Aviso: styled.h1`
        color: #c00;
        font-size: 1.5rem;
        text-align: center;
        margin-top: 2rem;
    `,

    Header: styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    `,

    Icons: styled.div`
        display: flex;
        gap: 0.75rem;

        a {
            display: flex;
            align-items: center;
            text-decoration: none;
        }
    `,
};
