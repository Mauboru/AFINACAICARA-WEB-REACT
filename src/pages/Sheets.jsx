import styled from "styled-components";
import MainLayout from '../layouts/MainLayout';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../components';

export default function Sheets() {
  const [musicList, setMusicList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [styles, setStyles] = useState([]);

  const [filterGroup, setFilterGroup] = useState('');
  const [filterLetter, setFilterLetter] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch('/musics.txt')
      .then(res => {
        if (!res.ok) throw new Error('Arquivo não encontrado');
        return res.text();
      })
      .then(data => {
        const musics = data
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => {
            const [id, title, style, group] = line.split(';');
            return { id: Number(id), title, style, group };
          })
          .filter(music => music.title);

        musics.sort((a, b) => a.title.localeCompare(b.title));
        setMusicList(musics);

        // Extrair grupos e estilos únicos
        const uniqueGroups = [...new Set(musics.map(m => m.group))].sort();
        const uniqueStyles = [...new Set(musics.map(m => m.style))].sort();

        setGroups(uniqueGroups);
        setStyles(uniqueStyles);
      })
      .catch(err => {
        console.error('Erro ao carregar o arquivo:', err);
      });
  }, []);

  const clearFilters = () => {
    setFilterGroup(""); 
    setFilterLetter("");
    setFilterStyle("");
  }

  const filteredMusics = musicList.filter(music => {
    if (filterGroup && music.group !== filterGroup) return false;
    if (filterLetter && music.title[0].toUpperCase() !== filterLetter) return false;
    if (filterStyle && music.style !== filterStyle) return false;
    return true;
  });

  const groupedMusics = filteredMusics.reduce((groups, music) => {
    const letter = music.title[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(music);
    return groups;
  }, {});

  const sortedLetters = Object.keys(groupedMusics).sort();

  return (
    <MainLayout>
      <Styled.Container>
        <Styled.Title>Lista de Músicas</Styled.Title>

        <Styled.FiltersContainer>
          <Styled.FilterLabel>
            Grupo:
            <Styled.FilterSelect
              onChange={e => setFilterGroup(e.target.value)}
              value={filterGroup}
            >
              <option value="">Todos</option>
              {groups.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Styled.FilterSelect>
          </Styled.FilterLabel>

          <Styled.FilterLabel>
            Letra:
            <Styled.FilterSelect
              onChange={e => setFilterLetter(e.target.value)}
              value={filterLetter}
            >
              <option value="">Todas</option>
              {sortedLetters.map(letter => (
                <option key={letter} value={letter}>
                  {letter}
                </option>
              ))}
            </Styled.FilterSelect>
          </Styled.FilterLabel>

          <Styled.FilterLabel>
            Estilo:
            <Styled.FilterSelect
              onChange={e => setFilterStyle(e.target.value)}
              value={filterStyle}
            >
              <option value="">Todos</option>
              {styles.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Styled.FilterSelect>
          </Styled.FilterLabel>

          <Styled.FilterLabel>
            <CustomButton onClick={clearFilters} variant="primary">Limpar Filtros</CustomButton>
          </Styled.FilterLabel>
        </Styled.FiltersContainer>

        {sortedLetters.map(letter => (
          <Styled.Group key={letter}>
            <Styled.Letter>{letter}</Styled.Letter>
            <ul>
              {groupedMusics[letter].map(music => (
                <Styled.Musics
                  key={music.id}
                  onClick={() => navigate(`/musicas/${music.id}`)}
                  tabIndex={0}
                  role="button"
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

  FiltersContainer: styled.div`
    margin-bottom: 1.5rem;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    @media (max-width: 600px) {
      gap: 1rem;
    }
  `,

  FilterLabel: styled.label`
    display: flex;
    flex-direction: column;
    font-weight: 600;
    font-size: 0.9rem;
    color: #1377b9;
    min-width: 120px;

    @media (max-width: 600px) {
      width: 100%;
      min-width: auto;
    }
  `,

  FilterSelect: styled.select`
    margin-top: 0.3rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #1377b9;
    background: white;
    color: #333;
    font-size: 1rem;

    &:focus {
      outline: 2px solid #1377b9;
      outline-offset: 2px;
    }
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