import { useEffect, useState, useRef } from "react";
import * as pitchy from "pitchy";

export default function Tuner() {
    const notes = [
        { name: "G", freq: 196.00, file: "/sounds/G3.mp3" },
        { name: "D", freq: 293.66, file: "/sounds/D4.mp3" },
        { name: "A", freq: 440.00, file: "/sounds/A4.mp3" },
        { name: "E", freq: 659.26, file: "/sounds/E5.mp3" }
    ];

    const [detectedNote, setDetectedNote] = useState("");
    const [offset, setOffset] = useState(0);
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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-gray-100">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center">
                <h1 className="text-2xl font-semibold mb-4">Afinador de Violino</h1>

                <p className="text-lg mb-2">Nota detectada:</p>
                <div className="text-4xl font-bold text-blue-700 h-10 mb-4">
                    {detectedNote || "..."}
                </div>

                <div className="relative h-2 w-full bg-gray-300 rounded-full mb-2">
                    <div
                        className={`absolute top-0 h-2 w-1 transition-all duration-100 ${
                            Math.abs(offset) < 5 ? "bg-green-500" : "bg-red-600"
                        }`}
                        style={{
                            left: `calc(50% + ${offset * 1.2}px)`, // amplifica visualmente
                        }}
                    />
                    <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-black" />
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Desvio: {offset.toFixed(2)} cent
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {notes.map(note => (
                        <button
                            key={note.name}
                            onClick={() => playNote(note.file)}
                            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Tocar {note.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
