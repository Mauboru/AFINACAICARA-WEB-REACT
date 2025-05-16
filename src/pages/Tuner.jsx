import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

export default function Tuner() {
  const chromaticNotes = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
  ];

  const instrumentNotesMap = {
    Rabeca: [
      { name: "A", freq: 440.00 },
      { name: "E", freq: 659.26 },
      { name: "B", freq: 493.88 },
      { name: "F#", freq: 739.99 }
    ],
    Violino: [
      { name: "G", freq: 196.00 },
      { name: "D", freq: 293.66 },
      { name: "A", freq: 440.00 },
      { name: "E", freq: 659.26 }
    ],
    Machete: [
      { name: "B", freq: 493.88 },
      { name: "E", freq: 659.26 },
      { name: "G#", freq: 415.30 },
      { name: "B", freq: 493.88 }
    ],
    Viola: [
      { name: "G", freq: 196.00 },
      { name: "D", freq: 293.66 },
      { name: "A", freq: 440.00 },
      { name: "E", freq: 659.26 }
    ],
    "Meia-Viola": [
      { name: "G", freq: 196.00 },
      { name: "F", freq: 293.66 },
      { name: "A", freq: 440.00 },
      { name: "E", freq: 659.26 }
    ]
  };

  const instruments = Object.keys(instrumentNotesMap);

  const [detectedNote, setDetectedNote] = useState("");
  const [detectedFreq, setDetectedFreq] = useState(null);
  const [offset, setOffset] = useState(0);
  const [instrument, setInstrument] = useState("Rabeca");

  const audioContextRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  const playTone = (freq, duration = 1) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine"; // tipo de onda: sine, square, sawtooth, triangle
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // volume baixo
    oscillator.start();

    oscillator.stop(audioCtx.currentTime + duration);
    
    oscillator.onended = () => {
      audioCtx.close();
    };
  };

  const noteNameToIndex = (noteName) => {
    return chromaticNotes.indexOf(noteName);
  };

  const formatNoteName = (noteName) => {
    return noteName;
  };

  const getClosestNote = (freq) => {
    const notes = instrumentNotesMap[instrument];
    return notes.reduce((prev, curr) =>
      Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
    );
  };

  const getCentOffset = (freq, refFreq) => {
    return 1200 * Math.log2(freq / refFreq);
  };

  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      let val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0,
      r2 = SIZE - 1,
      threshold = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }

    buffer = buffer.slice(r1, r2);
    const newSize = buffer.length;

    let c = new Array(newSize).fill(0);
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1,
      maxpos = -1;
    for (let i = d; i < newSize; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    let x1 = c[T0 - 1],
      x2 = c[T0],
      x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;

    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const smoothBuffer = (buffer) => {
    const smoothed = new Float32Array(buffer.length);
    for (let i = 1; i < buffer.length - 1; i++) {
      smoothed[i] = (buffer[i - 1] + buffer[i] + buffer[i + 1]) / 3;
    }
    return smoothed;
  };

  useEffect(() => {
    const initMic = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;

      const dataArray = new Float32Array(analyser.fftSize);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserNodeRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceRef.current = source;

      const process = () => {
        analyser.getFloatTimeDomainData(dataArray);
        const smoothed = smoothBuffer(dataArray);
        const pitch = autoCorrelate(smoothed, audioContext.sampleRate);

        if (pitch !== -1) {
          const closest = getClosestNote(pitch);
          const cents = getCentOffset(pitch, closest.freq);
          setDetectedNote(formatNoteName(closest.name));
          setOffset(Math.max(-50, Math.min(cents, 50)));
          setDetectedFreq(pitch);
        } else {
          setDetectedNote("");
          setOffset(0);
          setDetectedFreq(null);
        }

        requestAnimationFrame(process);
      };

      process();
    };

    initMic();
    return () => {
      audioContextRef.current?.close();
    };
  }, [instrument]);

  const playNote = (note) => {
    playTone(note.freq, 1); 
  };

  const getOffsetColor = (offset) => {
    const absOffset = Math.abs(offset);
    if (absOffset <= 5) return "#2ecc71";
    if (absOffset <= 15) return "#f1c40f";
    return "#e74c3c";
  };

  return (
    <Styled.Page>
      <Styled.ResponsiveSidebar>
        {instruments.map((item) => (
          <Styled.InstrumentButton
            key={item}
            onClick={() => setInstrument(item)}
            $active={instrument === item}
          >
            {item}
          </Styled.InstrumentButton>
        ))}
        <Styled.Logo src="/logo.png" alt="Mandicuera" />
      </Styled.ResponsiveSidebar>

      <Styled.Container>
        <Styled.Title>Afinador de {instrument}</Styled.Title>

        <Styled.NoteDisplay color={getOffsetColor(offset)}>
          Nota detectada: <strong>{detectedNote || "..."}</strong>
        </Styled.NoteDisplay>

        <Styled.OffsetBar>
          <Styled.Indicator style={{ left: `${offset + 50}%`, backgroundColor: getOffsetColor(offset) }} />
          <Styled.CenterLine />
        </Styled.OffsetBar>

        <Styled.Buttons>
          {instrumentNotesMap[instrument].map((note, idx) => (
            <Styled.NoteButton key={`${instrument}-${note.name}-${idx}`} onClick={() => playNote(note)}>
              {note.name}
            </Styled.NoteButton>
          ))}
        </Styled.Buttons>
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

  CenterLine: styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: ${({ theme }) => theme.colors.text};
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

  InstrumentButton: styled.button.attrs(() => ({}))`
    background: ${({ $active, theme }) =>
        $active ? theme.colors.primary : theme.colors.primaryDark};
    color: ${({ theme }) => theme.colors.text};
    border: none;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 8px 12px;
    }
  `,

  Logo: styled.img`
      height: 180px;
      margin-left: auto;

      @media (max-width: 768px) {
          order: 99;
          margin-left: 0;
          margin-top: 10px;
      }
  `,

  Container: styled.div`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;

      @media (max-width: 768px) {
          padding: 20px;
      }
  `,

  Title: styled.h1`
      font-size: 2rem;
      color: ${({ theme }) => theme.colors.text};
      margin-bottom: 20px;
      text-align: center;
  `,

  NoteDisplay: styled.div`
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: ${({ theme }) => theme.colors.text};
      text-align: center;
  `,

  OffsetBar: styled.div`
      width: 100%;
      max-width: 400px;
      height: 10px;
      background: ${({ theme }) => theme.colors.primaryTransparent2};
      position: relative;
      margin-bottom: 30px;
      border-radius: 5px;
  `,

  Indicator: styled.div`
      position: absolute;
      top: -5px;
      width: 4px;
      height: 20px;
      background: ${({ theme }) => theme.colors.primary};
      transition: left 0.1s ease;
  `,

  Buttons: styled.div`
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
  `,

  NoteButton: styled.button`
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.text};
      border: none;
      padding: 12px 20px;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
          background: ${({ theme }) => theme.colors.primaryDark};
      }

      @media (max-width: 768px) {
          padding: 10px 16px;
          font-size: 0.95rem;
      }
  `
};