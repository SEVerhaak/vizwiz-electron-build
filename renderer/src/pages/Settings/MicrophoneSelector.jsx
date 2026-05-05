import { useEffect, useRef, useState } from "react";

export default function MicrophoneSelector() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [volume, setVolume] = useState(0);

    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const animationRef = useRef(null);

    const dataArrayRef = useRef(null);
    const lastUpdateRef = useRef(0);

    // -----------------------------
    // Load microphone devices
    // -----------------------------
    useEffect(() => {
        async function loadDevices() {
            try {
                // Request permission once (needed for labels)
                const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                tempStream.getTracks().forEach(t => t.stop());

                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const inputs = allDevices.filter(d => d.kind === "audioinput");

                setDevices(inputs);

                if (inputs.length > 0) {
                    setSelectedDevice(inputs[0].deviceId);
                }
            } catch (err) {
                console.error("Mic permission error:", err);
            }
        }

        loadDevices();
    }, []);

    // -----------------------------
    // Start audio processing
    // -----------------------------
    useEffect(() => {
        if (!selectedDevice) return;

        let cancelled = false;

        async function startAudio() {
            try {
                // Stop previous stream + audio context
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                }

                if (audioContextRef.current) {
                    await audioContextRef.current.close();
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: { exact: selectedDevice } }
                });

                streamRef.current = stream;

                const AudioContext =
                    window.AudioContext || window.webkitAudioContext;

                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                analyserRef.current = analyser;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                dataArrayRef.current = dataArray;

                const loop = (time) => {
                    if (cancelled) return;

                    analyser.getByteFrequencyData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }

                    const avg = sum / dataArray.length;

                    // -----------------------------
                    // THROTTLE React updates (KEY FIX)
                    // -----------------------------
                    if (time - lastUpdateRef.current > 80) { // ~12 FPS
                        setVolume(avg);
                        lastUpdateRef.current = time;
                    }

                    animationRef.current = requestAnimationFrame(loop);
                };

                animationRef.current = requestAnimationFrame(loop);
            } catch (err) {
                console.error("Audio start error:", err);
            }
        }

        startAudio();

        return () => {
            cancelled = true;

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [selectedDevice]);

    // -----------------------------
    // Device change handler
    // -----------------------------
    const handleChange = (e) => {
        setSelectedDevice(e.target.value);
    };

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <div
            style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <h2>Microphone</h2>

            <select value={selectedDevice} onChange={handleChange}>
                {devices.map((d, i) => (
                    <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microphone ${i + 1}`}
                    </option>
                ))}
            </select>

            <h4>Microphone volume</h4>

            <div
                style={{
                    marginTop: "10px",
                    width: "250px",
                    height: "15px",
                    background: "#222",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        width: `${Math.min(volume, 100)}%`,
                        height: "100%",
                        background:
                            volume > 70
                                ? "red"
                                : volume > 40
                                    ? "orange"
                                    : "lime",
                        transition: "width 0.08s linear"
                    }}
                />
            </div>
        </div>
    );
}