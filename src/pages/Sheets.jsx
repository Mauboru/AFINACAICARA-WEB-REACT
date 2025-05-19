import styled from "styled-components";
import MainLayout from '../layouts/MainLayout';
import { useState, useEffect } from "react";

export default function Sheets() {
  const [musicList, setMusicList] = useState([]);

  useEffect(() => {
    const musics = [
      { id: 1, title: "Feliz" },
      { id: 2, title: "Marinheiro" },
      { id: 3, title: "Queromana" },
      { id: 4, title: "No Jardim" },
      { id: 5, title: "Peixe Morto" },
      { id: 6, title: "Menina você ta lembrada" },
      { id: 7, title: "Menina do cabelo comprido" },
      { id: 8, title: "Tamanduá no Baile" },
    ];

    musics.sort((a, b) => a.title.localeCompare(b.title));
    setMusicList(musics);
  }, []);

  const groupedMusics = musicList.reduce((groups, music) => {
    const letter = music.title[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(music);
    return groups;
  }, {});

  const sortedLetters = Object.keys(groupedMusics).sort();

  const handleClick = (title) => {
    alert(`Você clicou na música: ${title}`);
  };

  return (
    <MainLayout>
      <Styled.Container>
        <Styled.Title>Lista de Músicas</Styled.Title>
        {sortedLetters.map(letter => (
          <Styled.Group key={letter}>
            <Styled.Letter>{letter}</Styled.Letter>
            <ul>
              {groupedMusics[letter].map(music => (
                <Styled.Musics
                  key={music.id}
                  onClick={() => handleClick(music.title)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => e.key === 'Enter' && handleClick(music.title)}
                >
                  {music.title}
                </Styled.Musics>
              ))}
            </ul>
          </Styled.Group>
        ))}
      </Styled.Container>
    </MainLayout>
  );
}

const Styled = {
  Container: styled.div`
    padding: 1rem;
  `,

  Title: styled.h2`
    margin-bottom: 1rem;
  `,

  Group: styled.div`
    margin-bottom: 1.5rem;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  `,

  Letter: styled.h3`
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #1377b9;
    padding-bottom: 0.2rem;
    color: #1377b9;
  `,

  Musics: styled.li`
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    user-select: none;
    transition: background-color 0.2s;

    &:hover,
    &:focus {
      background-color: #1377b9;
      color: white;
      outline: none;
    }
  `,
};