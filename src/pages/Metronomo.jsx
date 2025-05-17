import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tick, setTick] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const playClick = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.frequency.value = 1000;
    gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);

    oscillator.onended = () => {
      audioCtx.close();
    };
  };

  const startMetronome = () => {
    const interval = 60000 / bpm;
    timerRef.current = setInterval(() => {
      playClick();
      setTick(true);
      setTimeout(() => setTick(false), 100);
    }, interval);
  };

  const stopMetronome = () => {
    clearInterval(timerRef.current);
    setTick(false);
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
  }, [bpm]);

  useEffect(() => {
    return () => stopMetronome();
  }, []);

  return (
    <Styled.Page>
      <Styled.ResponsiveSidebar>
        <Styled.InstrumentButton onClick={() => navigate("/")}>
          Afinador
        </Styled.InstrumentButton>
      </Styled.ResponsiveSidebar>

      <Styled.Container>
        <Styled.Logo src="/logo.png" alt="Mandicuera" />
        <Styled.Title>Metrônomo</Styled.Title>

        <Styled.TempoDisplay>
          {bpm} BPM
        </Styled.TempoDisplay>

        <Styled.Slider
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
        />

        <Styled.PlayButton onClick={toggleMetronome}>
          {isPlaying ? "Parar" : "Iniciar"}
        </Styled.PlayButton>

        <Styled.VisualBeat $active={tick} />
      </Styled.Container>
    </Styled.Page>
  );
}

const Styled = {
  Page: styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    font-family: Arial, sans-serif;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,

  ResponsiveSidebar: styled.div`
    width: 200px;
    background: ${({ theme }) => theme.colors.primaryDarkTwo};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding: 10px;
    }
  `,

  InstrumentButton: styled.button`
    background: ${({ theme }) => theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.text};
    border: none;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  `,

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

  Logo: styled.img`
    height: 180px;

    @media (max-width: 768px) {
      order: 99;
      margin-left: 0;
      margin-top: 10px;
    }
  `,

  Title: styled.h1`
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 10px;
    text-align: center;
  `,

  TempoDisplay: styled.div`
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  `,

  Slider: styled.input`
    width: 300px;
    max-width: 80%;
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

  VisualBeat: styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.primaryTransparent2};
    transition: background 0.1s;
  `
};
