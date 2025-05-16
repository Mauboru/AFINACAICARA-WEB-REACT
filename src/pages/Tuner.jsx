import { useEffect, useState, useRef } from "react";
import { detectPitch } from "pitchy";

export default function Tuner() {
    const notes = [
        { name: "G", file: "/sounds/G3.mp3" },
        { name: "D", file: "/sounds/D4.mp3" },
        { name: "A", file: "/sounds/A4.mp3" },
        { name: "E", file: "/sounds/E5.mp3" }
    ];

    const [detectedNote, setDetectedNote] = useState("");
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Float32Array | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const noteFromFrequency = (freq) => {
        const noteFreqs = [
            { name: "G", freq: 196.00 },
            { name: "D", freq: 293.66 },
            { name: "A", freq: 440.00 },
            { name: "E", freq: 659.26 }
        ];

        let closest = noteFreqs.reduce((prev, curr) =>
            Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
        );

        return closest.name;
    };

    useEffect(() => {
        const initMic = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || (window).webkitAudioContext)();
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
                const [pitch, clarity] = detectPitch(dataArray, audioContext.sampleRate);

                if (clarity > 0.9) {
                    const note = noteFromFrequency(pitch);
                    setDetectedNote(note);
                } else {
                    setDetectedNote("");
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
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Afinador de Violino</h1>

            <div className="mb-6">
                <p className="text-lg">Nota detectada: <strong>{detectedNote || "..."}</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {notes.map(note => (
                    <button
                        key={note.name}
                        onClick={() => playNote(note.file)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {note.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
