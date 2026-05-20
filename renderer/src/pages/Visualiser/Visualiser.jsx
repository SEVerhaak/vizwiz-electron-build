import {useEffect, useRef, useState} from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import extraPresets from "butterchurn-presets/lib/butterchurnPresetsExtra.min.js";
import extraPresets2 from "butterchurn-presets/lib/butterchurnPresetsExtra2.min.js";
import presetsNonMinimal from "butterchurn-presets/lib/butterchurnPresetsNonMinimal.min.js";
import presetsMD1 from "butterchurn-presets/lib/butterchurnPresetsMD1.min.js";
import {useParams, useNavigate} from "react-router-dom";

import "./Visualiser.css"; // <-- Import CSS

export default function Visualizer() {

    let frameId;

    const navigate = useNavigate();

    const {presetKey} = useParams(); // get the clicked preset key

    const butterchurnLib = butterchurn.default || butterchurn;

    const canvasRef = useRef(null);
    const selectRef = useRef(null);

    // Retrieve visualizer settings
    const savedSettings = JSON.parse(localStorage.getItem("vizwiz_settings")) || {};
    const presetCycle = typeof savedSettings.presetCycle === "boolean" ? savedSettings.presetCycle : true;
    const presetCycleLength = typeof savedSettings.presetCycleLength === "number" ? savedSettings.presetCycleLength : 15000;

    console.log("Preset Cycle:", presetCycle);
    console.log("Preset Cycle Length (ms):", presetCycleLength);

    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const currentPlaylist = JSON.parse(
            localStorage.getItem("playlists_current")
        );

        const canvas = canvasRef.current;
        const presetSelect = selectRef.current;

        const visualizer = butterchurnLib.createVisualizer(null, canvas, {
            width: window.innerWidth,
            height: window.innerHeight,
            mesh_width: 64,
            mesh_height: 48,
            pixelRatio: window.devicePixelRatio || 1,
            textureRatio: 1,
        });

        // =========================
        // PRESET SOURCE SETUP
        // =========================

        const allPacks = {
            Default: butterchurnPresets.getPresets(),
            Extra: extraPresets.getPresets(),
            Extra2: extraPresets2.getPresets(),
            NonMinimal: presetsNonMinimal.getPresets(),
            MD1: presetsMD1.getPresets(),
        };

        let mergedPresets = {};
        let presetKeys = [];

        // 🎯 PRIORITY: runtime playlist
        if (currentPlaylist?.presets?.length > 0) {
            console.log("🎵 Using playlists_current");

            const packData = Object.values(allPacks).reduce(
                (acc, pack) => ({ ...acc, ...pack }),
                {}
            );

            presetKeys = currentPlaylist.presets;

            presetKeys.forEach((key) => {
                if (packData[key]) {
                    mergedPresets[key] = packData[key];
                }
            });
        } else {
            console.log("🎛️ Using default packs");

            const selectedPackNames =
                JSON.parse(localStorage.getItem("vizwiz_packs")) || ["Default"];

            const activePacks = Object.entries(allPacks).filter(([name]) =>
                selectedPackNames.includes(name)
            );

            activePacks.forEach(([_, presets]) => {
                Object.entries(presets).forEach(([key, value]) => {
                    if (!mergedPresets[key]) mergedPresets[key] = value;
                });
            });

            presetKeys = Object.keys(mergedPresets);
        }

        if (presetKeys.length === 0) {
            console.warn("No presets found, falling back to Default");
            mergedPresets = allPacks.Default;
            presetKeys = Object.keys(mergedPresets);
        }

        console.log("✅ Active preset count:", presetKeys.length);

        // =========================
        // PRESET INDEX SETUP
        // =========================

        let presetIndex = presetKey
            ? presetKeys.indexOf(presetKey)
            : Math.floor(Math.random() * presetKeys.length);

        if (presetIndex === -1) {
            presetIndex = Math.floor(Math.random() * presetKeys.length);
        }

        let presetIndexHist = [];
        let cycleInterval = null;

        // =========================
        // FUNCTIONS
        // =========================

        function loadPreset(index, blend = 5.7) {
            visualizer.loadPreset(mergedPresets[presetKeys[index]], blend);
            presetSelect.value = index;
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

        // =========================
        // DROPDOWN
        // =========================

        presetKeys.forEach((key, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = key;
            presetSelect.appendChild(option);
        });

        presetSelect.addEventListener("change", (e) => {
            const index = parseInt(e.target.value, 10);
            presetIndex = index;
            loadPreset(presetIndex);
            restartCycleInterval();
        });

        // =========================
        // RESIZE
        // =========================

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            visualizer.setRendererSize(canvas.width, canvas.height);
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // =========================
        // KEYBOARD
        // =========================

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
                case "Escape":
                    navigate("/");
                    break;
            }
        }

        document.addEventListener("keydown", handleKey);

        // =========================
        // AUDIO
        // =========================

        let audioContext;
        let stream;
        let analyser;

        const savedMic = localStorage.getItem("settings_mic");

        const audioConstraints = {
            audio: savedMic
                ? { deviceId: { ideal: savedMic } }
                : true
        };

        if (savedMic) {
            console.log("🎧 Visualizer using saved microphone:", savedMic);
        } else {
            console.log("🎧 Visualizer using default microphone (no saved mic)");
        }

        navigator.mediaDevices
            .getUserMedia(audioConstraints)
            .then((s) => {
                stream = s;

                audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);

                analyser = audioContext.createAnalyser();
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
                                timeByteArrayR: Array.from(dataArray),
                            },
                        });
                    } catch (err) {
                        console.warn("Render error:", err);
                    }

                    frameId = requestAnimationFrame(render);
                }

                render();
            })
            .catch((err) => {
                console.error("Mic failed:", err);
            });

        // =========================
        // INIT FIRST PRESET
        // =========================

        loadPreset(presetIndex, 0);
        restartCycleInterval();

        // =========================
        // CLEANUP
        // =========================

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            document.removeEventListener("keydown", handleKey);

            if (cycleInterval) clearInterval(cycleInterval);

            try {
                stream?.getTracks().forEach((t) => t.stop());
            } catch {}

            try {
                audioContext?.close();
            } catch {}
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