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
        fetch('/musics.txt')
          .then(res => res.text())
          .then(text => {
            const lines = text.trim().split('\n');
            const musics = lines.map(line => {
              const parts = line.split(';');
      
              return {
                id: Number(parts[0]),
                title: parts[1],
                style: parts[2],
                group: parts[3],
                author: parts[4],
                album: parts[5],
                year: Number(parts[6]),
                band: parts[7],
                spotify: parts[8] || '',
                youtube: parts[9] || '',
                soundcloud: parts[10] || '',
                letter: parts.slice(11).join(';') || '',
              };
            });
      
            musics.sort((a, b) => a.title.localeCompare(b.title));
            setMusicList(musics);
      
            const found = musics.find((m) => m.id === Number(id));
            setMusic(found);
          })
          .catch(() => {
            setMusicList([]);
            setMusic(null);
          });
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
                    <Styled.Info><strong>Grupo:</strong> {music.band}</Styled.Info>
                    <Styled.Lyrics>{music.letter.split('\\n').join('\n')}</Styled.Lyrics>
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
