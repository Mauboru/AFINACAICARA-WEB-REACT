import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MainLayout from '../layouts/MainLayout';

export default function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [timeSignature, setTimeSignature] = useState(4);
  const timerRef = useRef(null);

  const playClick = (isDownbeat) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.frequency.value = isDownbeat ? 1200 : 800;
    gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);

    oscillator.onended = () => {
      audioCtx.close();
    };
  };
  
  const startMetronome = () => {
    const interval = 60000 / bpm;
    let currentBeat = 0;

    timerRef.current = setInterval(() => {
      const isDownbeat = currentBeat === 0;
      playClick(isDownbeat);
      setBeatIndex(currentBeat);
      currentBeat = (currentBeat + 1) % timeSignature;
    }, interval);
  };

  const stopMetronome = () => {
    clearInterval(timerRef.current);
    setBeatIndex(-1);
  };

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, timeSignature]);

  useEffect(() => {
    return () => stopMetronome();
  }, []);

  return (
    <MainLayout>
      <Styled.Container>
        <Styled.Title>Metrônomo</Styled.Title>

        <Styled.TempoDisplay>{bpm} BPSM</Styled.TempoDisplay>

        <Styled.Slider
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
        />

        <Styled.TimeSignatureSelect
          value={timeSignature}
          onChange={(e) => setTimeSignature(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>
              {num}/4
            </option>
          ))}
        </Styled.TimeSignatureSelect>

        <Styled.PlayButton onClick={toggleMetronome}>
          {isPlaying ? "Parar" : "Iniciar"}
        </Styled.PlayButton>

        <Styled.BeatContainer>
          {[...Array(timeSignature)].map((_, idx) => (
            <Styled.BeatCircle
              key={idx}
              $active={isPlaying && beatIndex === idx}
              $isDownbeat={idx === 0}
            />
          ))}
        </Styled.BeatContainer>
      </Styled.Container>
    </MainLayout>
  );
}

const Styled = {
  Container: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    gap: 20px;

    @media (max-width: 768px) {
      padding: 20px;
    }
  `,

  Title: styled.h1`
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 10px;
    text-align: center;
  `,

  TempoDisplay: styled.div`
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primaryDark};
  `,

  Slider: styled.input`
    width: 300px;
    max-width: 80%;
  `,

  TimeSignatureSelect: styled.select`
    margin-top: 10px;
    padding: 6px 12px;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: ${({ theme }) => theme.colors.background || '#fff'};
    color: ${({ theme }) => theme.colors.text || '#000'};
  `,

  PlayButton: styled.button`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    border: none;
    padding: 10px 20px;
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  `,

  BeatContainer: styled.div`
    display: flex;
    gap: 15px;
    margin-top: 20px;
  `,

  BeatCircle: styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${({ $active, $isDownbeat, theme }) =>
      $active
        ? $isDownbeat
          ? theme.colors.primaryDark
          : theme.colors.primary
        : $isDownbeat
        ? theme.colors.primary
        : theme.colors.primaryDark};
    border: ${({ $isDownbeat }) => ($isDownbeat ? "2px solid black" : "none")};
    transition: background 0.1s;
  `,
};
