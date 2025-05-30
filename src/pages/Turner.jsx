import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import MainLayout from '../layouts/MainLayout';
import { useTuner } from '../context/TurnerContext';

export default function Turner() {
  const chromaticNotes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];
  const keySemitoneOffsets = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
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
  const instrumentReferenceNote = { Rabeca: "A", Violino: "G", Machete: "B", Viola: "A", "Meia-Viola": "A" };
  
  const [detectedNote, setDetectedNote] = useState("");
  const [detectedFreq, setDetectedFreq] = useState(null);
  const [offset, setOffset] = useState(0);
  const audioContextRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  const formatNoteName = (noteName) => noteName;

  const playTone = (freq, duration = 1) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); 
    oscillator.start();

    oscillator.stop(audioCtx.currentTime + duration);
    
    oscillator.onended = () => {
      audioCtx.close();
    };
  };

  const transposeNotes = (notes, semitones) => {
    return notes.map(note => {
      const originalIndex = chromaticNotes.indexOf(note.name);
      if (originalIndex === -1) {
        return { ...note };
      }
      const transposedIndex = (originalIndex + semitones + 12) % 12;
      const transposedName = chromaticNotes[transposedIndex];
      const transposedFreq = note.freq * Math.pow(2, semitones / 12);
      return {
        name: transposedName,
        freq: transposedFreq,
      };
    });
  };
  
  const { instrument, note } = useTuner();
  const baseNotes = instrumentNotesMap[instrument] || [];
  const referenceNote = instrumentReferenceNote[instrument] || baseNotes[2]?.name || "A";
  const semitones = keySemitoneOffsets[note] - keySemitoneOffsets[referenceNote];
  const notes = transposeNotes(baseNotes, semitones);

  const getClosestNote = (freq) => {
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

  const playNote = (note) => {
    playTone(note.freq, 1); 
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
          const degreesOffset = (cents / 50) * 45; 
          setOffset(Math.max(-45, Math.min(degreesOffset, 45)));
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
  }, [instrument, note]);

  return (
    <MainLayout>
      <Styled.Container>
        <Styled.Title>Afinador de {instrument}</Styled.Title>

        <Styled.TurnerDisplay>
          <Styled.Needle offset={offset} />
          <Styled.Scale>
            <span>-50</span>
            <span>-25</span>
            <span>0</span>
            <span>+25</span>
            <span>+50</span>
          </Styled.Scale>
        </Styled.TurnerDisplay>

        <Styled.NoteBig>{detectedNote || "A"}</Styled.NoteBig>

        <Styled.FrequencySmall>
          {detectedFreq ? `${detectedFreq.toFixed(1)} Hz | ${offset.toFixed(1)} cents` : "00.0 Hz | 00.0 cents"}
        </Styled.FrequencySmall>

        <Styled.Buttons>
          {notes.map((note, idx) => (
            <Styled.NoteButton key={`${instrument}-${note.name}-${idx}`} onClick={() => playNote(note)}>
              {note.name}
            </Styled.NoteButton>
          ))}
        </Styled.Buttons>
      </Styled.Container>
    </MainLayout>
  );
}

const Styled = {
  TurnerDisplay: styled.div`
    position: relative;
    width: 200px;
    height: 100px;
    margin: 40px auto;
    border-top-left-radius: 200px;
    border-top-right-radius: 200px;
    background: #222;
    border: 2px solid #555;
  `,

  Needle: styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 2px;
    height: 90px;
    background: red;
    transform: rotate(${props => props.offset}deg);
    transform-origin: bottom center;
    transition: transform 0.1s ease;
  `,

  Scale: styled.div`
    position: absolute;
    width: 100%;
    bottom: 5px;
    display: flex;
    justify-content: space-between;
    color: #ccc;
    font-size: 0.75rem;
  `,

  NoteBig: styled.div`
    font-size: 3rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primaryDark};
    text-align: center;
  `,

  FrequencySmall: styled.div`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.primaryDark};
    text-align: center;
    margin-top: 0.5rem;
    padding-bottom: 2rem;
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
    color: ${({ theme }) => theme.colors.primaryDark};
    margin-bottom: 20px;
    text-align: center;
  `,

  Buttons: styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
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
    min-width: 70px;
    text-align: center;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }

    @media (max-width: 768px) {
      padding: 10px 16px;
      font-size: 0.95rem;
      flex: 1 1 80px;
      max-width: 100px;
    }
  `,
};
