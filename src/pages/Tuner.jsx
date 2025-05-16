import { useEffect, useState, useRef } from "react";
import * as pitchy from "pitchy";
import styled from "styled-components";

export default function Tuner() {
    const notes = [
        { name: "G", freq: 196.00, file: "/sounds/G3.mp3" },
        { name: "D", freq: 293.66, file: "/sounds/D4.mp3" },
        { name: "A", freq: 440.00, file: "/sounds/A4.mp3" },
        { name: "E", freq: 659.26, file: "/sounds/E5.mp3" }
    ];

    const instruments = ["Rabeca", "Machete", "Viola", "Meia-Viola"];

    const [detectedNote, setDetectedNote] = useState("");
    const [offset, setOffset] = useState(0);
    const [instrument, setInstrument] = useState("Rabeca");

    const audioContextRef = useRef(null);
    const analyserNodeRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);

    const getClosestNote = (freq) => {
        return notes.reduce((prev, curr) =>
            Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
        );
    };

    const getCentOffset = (freq, refFreq) => {
        return 1200 * Math.log2(freq / refFreq);
    };

    useEffect(() => {
        const initMic = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;

            const dataArray = new Float32Array(analyser.fftSize);
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserNodeRef.current = analyser;
            dataArrayRef.current = dataArray;
            sourceRef.current = source;

            const process = () => {
                analyser.getFloatTimeDomainData(dataArray);
                const [pitch, clarity] = pitchy.detectPitch(dataArray, audioContext.sampleRate);

                if (clarity > 0.9) {
                    const closest = getClosestNote(pitch);
                    const cents = getCentOffset(pitch, closest.freq);
                    setDetectedNote(closest.name);
                    setOffset(Math.max(-50, Math.min(cents, 50))); // limita o range visual
                } else {
                    setDetectedNote("");
                    setOffset(0);
                }

                requestAnimationFrame(process);
            };

            process();
        };

        initMic();
        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const playNote = (file) => {
        const audio = new Audio(file);
        audio.play();
    };

    return (
        <Styled.Page>
            <Styled.ResponsiveSidebar>
                {instruments.map((item) => (
                    <Styled.InstrumentButton
                        key={item}
                        onClick={() => setInstrument(item)}
                        active={instrument === item}
                    >
                        {item}
                    </Styled.InstrumentButton>
                ))}

                <Styled.Logo src="/logo.png" alt="Mandicuera" />
            </Styled.ResponsiveSidebar>
    
            <Styled.Container>
                <Styled.Title>Afinador de {instrument}</Styled.Title>
    
                <Styled.NoteDisplay>
                    Nota detectada: <strong>{detectedNote || "..."}</strong>
                </Styled.NoteDisplay>
    
                <Styled.OffsetBar>
                    <Styled.Indicator style={{ left: `${offset + 50}%` }} />
                </Styled.OffsetBar>
    
                <Styled.Buttons>
                    {notes.map((note) => (
                        <Styled.NoteButton key={note.name} onClick={() => playNote(note.file)}>
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
        background: ${({ active, theme }) =>
            active ? theme.colors.primary : theme.colors.primaryDark};
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
