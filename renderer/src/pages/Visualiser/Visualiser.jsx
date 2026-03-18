import {useEffect, useRef, useState} from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import extraPresets from "butterchurn-presets/lib/butterchurnPresetsExtra.min.js";
import extraPresets2 from "butterchurn-presets/lib/butterchurnPresetsExtra2.min.js";
import presetsNonMinimal from "butterchurn-presets/lib/butterchurnPresetsNonMinimal.min.js";
import presetsMD1 from "butterchurn-presets/lib/butterchurnPresetsMD1.min.js";
import {useParams} from "react-router-dom";
import "./Visualiser.css"; // <-- Import CSS

export default function Visualizer() {

    const {presetKey} = useParams(); // get the clicked preset key

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

        // Load all packs
        const allPacks = {
            Default: butterchurnPresets.getPresets(),
            Extra: extraPresets.getPresets(),
            Extra2: extraPresets2.getPresets(),
            NonMinimal: presetsNonMinimal.getPresets(),
            MD1: presetsMD1.getPresets(),
        };

        // Get selected packs from settings
        const selectedPackNames = JSON.parse(localStorage.getItem("vizwiz_packs")) || ["Default"];

        console.log("🎛️ Selected preset packs:", selectedPackNames);

        // Filter packs
        const activePacks = Object.entries(allPacks).filter(([name]) =>
            selectedPackNames.includes(name)
        );

        // Merge + dedupe
        const mergedPresets = {};
        activePacks.forEach(([packName, presets]) => {
            Object.entries(presets).forEach(([key, value]) => {
                if (!mergedPresets[key]) {
                    mergedPresets[key] = value;
                }
            });
        });

        const presetKeys = Object.keys(mergedPresets);

        if (presetKeys.length === 0) {
            console.warn("No preset packs selected, falling back to Default");
            Object.assign(mergedPresets, allPacks.Default);
        }

        console.log("✅ Active preset count:", presetKeys.length);

        let presetIndex = presetKey
            ? presetKeys.indexOf(presetKey)
            : Math.floor(Math.random() * presetKeys.length);

        if (presetIndex === -1) presetIndex = Math.floor(Math.random() * presetKeys.length);

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

        // Load the initial preset
        function loadPreset(index, blend = 5.7) {
            visualizer.loadPreset(mergedPresets[presetKeys[index]], blend);
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
            .getUserMedia({audio: true})
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

        // nextPreset(0);
        loadPreset(presetIndex, 0); // URL preset or random fallback
        restartCycleInterval();

        // Cleanup (important in React)
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            document.removeEventListener("keydown", handleKey);
            if (cycleInterval) clearInterval(cycleInterval);
        };
    }, [presetKey]);

    return (
        <>
            <select
                ref={selectRef}
                className={`visualizer-select ${dropdownVisible ? "visible" : ""}`}
            />
            <canvas ref={canvasRef} className="visualizer-canvas"/>
        </>
    );
}