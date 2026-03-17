import { useEffect, useRef, useState } from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";

export default function Visualizer() {
    const butterchurnLib = butterchurn.default || butterchurn;

    const canvasRef = useRef(null);
    const selectRef = useRef(null);

    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const presetSelect = selectRef.current;

        const visualizer = butterchurnLib.createVisualizer(null, canvas, {
            width: window.innerWidth,
            height: window.innerHeight,
            mesh_width: 64,
            mesh_height: 48,
            pixelRatio: window.devicePixelRatio || 1,
            textureRatio: 1
        });

        const presets = butterchurnPresets.getPresets();
        const presetKeys = Object.keys(presets);

        let presetIndex = Math.floor(Math.random() * presetKeys.length);
        let presetIndexHist = [];
        let presetCycle = true;
        let cycleInterval = null;
        const presetCycleLength = 15000;

        // Populate dropdown
        presetKeys.forEach((key, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = key;
            presetSelect.appendChild(option);
        });

        function loadPreset(index, blend = 5.7) {
            visualizer.loadPreset(presets[presetKeys[index]], blend);
            presetSelect.value = index;
        }

        function nextPreset(blendTime = 5.7) {
            presetIndexHist.push(presetIndex);
            presetIndex = Math.floor(Math.random() * presetKeys.length);
            loadPreset(presetIndex, blendTime);
            restartCycleInterval();
        }

        function prevPreset(blendTime = 5.7) {
            if (presetIndexHist.length > 0) {
                presetIndex = presetIndexHist.pop();
            } else {
                presetIndex =
                    (presetIndex - 1 + presetKeys.length) % presetKeys.length;
            }
            loadPreset(presetIndex, blendTime);
            restartCycleInterval();
        }

        function restartCycleInterval() {
            if (cycleInterval) clearInterval(cycleInterval);
            if (presetCycle) {
                cycleInterval = setInterval(
                    () => nextPreset(2.7),
                    presetCycleLength
                );
            }
        }

        // Resize
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            visualizer.setRendererSize(canvas.width, canvas.height);
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Dropdown change
        presetSelect.addEventListener("change", (e) => {
            const index = parseInt(e.target.value, 10);
            presetIndex = index;
            loadPreset(presetIndex);
            restartCycleInterval();
        });

        // Keyboard controls
        function handleKey(e) {
            switch (e.key) {
                case " ":
                case "ArrowRight":
                    nextPreset();
                    break;
                case "Backspace":
                case "ArrowLeft":
                    prevPreset();
                    break;
                case "h":
                case "H":
                    nextPreset(0);
                    break;
                case "b":
                case "B":
                    setDropdownVisible((v) => !v);
                    break;
            }
        }

        document.addEventListener("keydown", handleKey);

        // Audio
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();

                analyser.fftSize = 1024;
                source.connect(analyser);

                function render() {
                    const dataArray = new Uint8Array(analyser.fftSize);
                    analyser.getByteTimeDomainData(dataArray);

                    try {
                        visualizer.render({
                            elapsedTime: 1 / 60,
                            audioLevels: {
                                timeByteArray: Array.from(dataArray),
                                timeByteArrayL: Array.from(dataArray),
                                timeByteArrayR: Array.from(dataArray)
                            }
                        });
                    } catch (err) {
                        console.warn("Render error:", err);
                    }

                    requestAnimationFrame(render);
                }

                render();
            })
            .catch((err) => {
                console.error("Mic failed:", err);
            });

        nextPreset(0);
        restartCycleInterval();

        // Cleanup (important in React)
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            document.removeEventListener("keydown", handleKey);
            if (cycleInterval) clearInterval(cycleInterval);
        };
    }, []);

    return (
        <>
            <select
                ref={selectRef}
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 10,
                    padding: 5,
                    fontSize: 14,
                    display: dropdownVisible ? "block" : "none"
                }}
            />

            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block"
                }}
            />
        </>
    );
}