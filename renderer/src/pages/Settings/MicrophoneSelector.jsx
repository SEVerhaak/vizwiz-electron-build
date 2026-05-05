import { useEffect, useRef, useState } from "react";

export default function MicrophoneSelector() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [volume, setVolume] = useState(0);

    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);

    // Load devices
    useEffect(() => {
        async function loadDevices() {
            try {
                // Request permission so labels show
                await navigator.mediaDevices.getUserMedia({ audio: true });

                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const inputs = allDevices.filter(d => d.kind === "audioinput");

                setDevices(inputs);

                if (inputs.length > 0) {
                    setSelectedDevice(inputs[0].deviceId);
                }
            } catch (err) {
                console.error(err);
            }
        }

        loadDevices();
    }, []);

    // Start audio meter when device changes
    useEffect(() => {
        if (!selectedDevice) return;

        let audioContext;

        async function startMeter() {
            // Stop previous stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: selectedDevice } }
            });

            streamRef.current = stream;

            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const update = () => {
                analyser.getByteFrequencyData(dataArray);

                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }

                setVolume(sum / dataArray.length);
                animationRef.current = requestAnimationFrame(update);
            };

            update();
        }

        startMeter();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (audioContext) audioContext.close();
        };
    }, [selectedDevice]);

    const handleChange = (e) => {
        const id = e.target.value;
        setSelectedDevice(id);

        const device = devices.find(d => d.deviceId === id);
        console.log("Selected mic:", device);
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Microphone</h3>

            <select value={selectedDevice} onChange={handleChange}>
                {devices.map((d, i) => (
                    <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microphone ${i + 1}`}
                    </option>
                ))}
            </select>

            {/* Volume meter */}
            <div style={{ marginTop: "10px" }}>
                <div
                    style={{
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
                                volume > 70 ? "red" :
                                    volume > 40 ? "orange" :
                                        "lime",
                            transition: "width 0.1s linear"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}