import React, { useEffect, useState, useRef } from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import { useNavigate } from "react-router-dom";
import "./Overview.css"; // <-- Import the CSS

const butterchurnLib = butterchurn.default || butterchurn;
const presets = butterchurnPresets.getPresets();
const presetKeys = Object.keys(presets);

export default function Overview() {
    const navigate = useNavigate();

    const presetsPerPage = 6;
    const [page, setPage] = useState(0);
    const [currentKeys, setCurrentKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const vizRefs = useRef([]);
    const loops = useRef([]);
    const analyserRef = useRef(null);

    const canvasWidth = 640;
    const canvasHeight = 360;

    // Update current keys when page changes
    useEffect(() => {
        const start = page * presetsPerPage;
        const end = Math.min(start + presetsPerPage, presetKeys.length);
        setCurrentKeys(presetKeys.slice(start, end));
    }, [page]);

    // Cleanup all visualizers on unmount or page change
    useEffect(() => {
        return () => {
            loops.current.forEach((loop) => cancelAnimationFrame(loop));
            vizRefs.current = [];
            loops.current = [];
        };
    }, [currentKeys]);

    // Setup microphone and visualizers
    useEffect(() => {
        vizRefs.current = [];
        loops.current = [];
        setLoading(true);

        const setupMic = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                source.connect(analyser);
                analyserRef.current = analyser;

                let initializedCount = 0;

                currentKeys.forEach((key, idx) => {
                    const canvas = document.getElementById(`preview-${idx}`);
                    if (!canvas) return;

                    const viz = butterchurnLib.createVisualizer(audioContext, canvas, {
                        width: canvasWidth,
                        height: canvasHeight,
                        mesh_width: 64,
                        mesh_height: 48,
                        pixelRatio: 1,
                        textureRatio: 1,
                    });

                    viz.loadPreset(presets[key], 0);
                    vizRefs.current.push(viz);

                    // Each canvas has its own animation loop
                    const renderLoop = () => {
                        if (!analyserRef.current) return;
                        const dataArray = new Uint8Array(analyserRef.current.fftSize);
                        analyserRef.current.getByteTimeDomainData(dataArray);

                        viz.render({
                            elapsedTime: 1 / 60,
                            audioLevels: {
                                timeByteArray: Array.from(dataArray),
                                timeByteArrayL: Array.from(dataArray),
                                timeByteArrayR: Array.from(dataArray),
                            },
                        });
                        loops.current[idx] = requestAnimationFrame(renderLoop);
                    };

                    renderLoop();

                    // Track initialization to hide loading overlay
                    initializedCount++;
                    if (initializedCount === currentKeys.length) {
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error("Microphone access failed:", err);
                setLoading(false);
            }
        };

        setupMic();

        return () => {
            loops.current.forEach((loop) => cancelAnimationFrame(loop));
        };
    }, [currentKeys]);

    const nextPage = () => {
        const maxPage = Math.floor((presetKeys.length - 1) / presetsPerPage);
        setPage((prev) => (prev < maxPage ? prev + 1 : 0));
    };

    const prevPage = () => {
        const maxPage = Math.floor((presetKeys.length - 1) / presetsPerPage);
        setPage((prev) => (prev > 0 ? prev - 1 : maxPage));
    };

    return (
        <div className="overview-container">
            <button className="overview-back-button" onClick={() => navigate("/")}>
                ← Back
            </button>

            <h1 className="overview-title">Preset Overview</h1>

            {loading && <div className="overview-loading">Loading presets...</div>}

            <div className="overview-grid">
                {currentKeys.map((key, idx) => (
                    <div key={idx} className="overview-canvas-wrapper">
                        <canvas
                            id={`preview-${idx}`}
                            width={canvasWidth}
                            height={canvasHeight}
                            className="overview-canvas"
                            onClick={() => navigate(`/visualizer/${encodeURIComponent(key)}`)}
                        />
                        <p className="overview-canvas-label">{key}</p>
                    </div>
                ))}
            </div>

            <div className="overview-pagination">
                <button onClick={prevPage}>← Previous 6 Presets</button>
                <button onClick={nextPage}>Next 6 Presets →</button>
            </div>
        </div>
    );
}