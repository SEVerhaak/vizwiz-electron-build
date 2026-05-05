import React, { useEffect, useState, useRef, useMemo } from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import extraPresets from "butterchurn-presets/lib/butterchurnPresetsExtra.min.js";
import extraPresets2 from "butterchurn-presets/lib/butterchurnPresetsExtra2.min.js";
import presetsNonMinimal from "butterchurn-presets/lib/butterchurnPresetsNonMinimal.min.js";
import presetsMD1 from "butterchurn-presets/lib/butterchurnPresetsMD1.min.js";
import { useNavigate, useLocation } from "react-router-dom";
import "./Overview.css";

const butterchurnLib = butterchurn.default || butterchurn;

// All packs
const allPacks = {
    Default: butterchurnPresets.getPresets(),
    Extra: extraPresets.getPresets(),
    Extra2: extraPresets2.getPresets(),
    NonMinimal: presetsNonMinimal.getPresets(),
    MD1: presetsMD1.getPresets(),
};

export default function Overview() {
    const navigate = useNavigate();
    const location = useLocation();

    const presetsPerPage = 6;

    const [selectedPacks, setSelectedPacks] = useState(["Default"]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const vizRefs = useRef([]);
    const loops = useRef([]);
    const analyserRef = useRef(null);

    const canvasWidth = 640;
    const canvasHeight = 360;

    // Load packs from localStorage
    const loadPacks = () => {
        const saved = JSON.parse(localStorage.getItem("vizwiz_packs"));
        if (Array.isArray(saved) && saved.length > 0) {
            setSelectedPacks(saved);
        } else {
            setSelectedPacks(["Default"]);
        }
    };

    useEffect(() => {
        loadPacks();
    }, []);

    // Refresh packs when returning from settings
    useEffect(() => {
        if (location.state?.refresh) {
            loadPacks();
        }
    }, [location.state]);

    // Merge selected presets
    const mergedPresets = useMemo(() => {
        const effective = selectedPacks.length ? selectedPacks : ["Default"];
        const merged = {};
        Object.entries(allPacks)
            .filter(([name]) => effective.includes(name))
            .forEach(([_, pack]) => {
                Object.entries(pack).forEach(([key, value]) => {
                    if (!merged[key]) merged[key] = value;
                });
            });
        return merged;
    }, [selectedPacks]);

    const presetKeys = useMemo(() => Object.keys(mergedPresets), [mergedPresets]);
    const totalPages = Math.ceil(presetKeys.length / presetsPerPage);

    // Reset page when presets change
    useEffect(() => {
        setPage(0);
    }, [presetKeys.length]);

    // Current page keys
    const currentKeys = useMemo(() => {
        const start = page * presetsPerPage;
        return presetKeys.slice(start, start + presetsPerPage);
    }, [page, presetKeys]);

    // Cleanup visualizers
    const cleanupVisualizers = () => {
        loops.current.forEach((loop) => cancelAnimationFrame(loop));

        vizRefs.current.forEach((viz) => {
            if (viz?.gl) {
                const ext = viz.gl.getExtension("WEBGL_lose_context");
                ext?.loseContext();
            }
        });

        vizRefs.current = [];
        loops.current = [];
    };

    useEffect(() => cleanupVisualizers, []);

    // Setup visualizers
    useEffect(() => {
        cleanupVisualizers();
        setLoading(true);

        const setup = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                source.connect(analyser);
                analyserRef.current = analyser;

                let initialized = 0;

                currentKeys.forEach((key, idx) => {
                    const canvas = document.getElementById(`preview-${key}`);
                    if (!canvas) return;

                    const viz = butterchurnLib.createVisualizer(audioContext, canvas, {
                        width: canvasWidth,
                        height: canvasHeight,
                    });

                    viz.loadPreset(mergedPresets[key], 0);
                    vizRefs.current.push(viz);

                    const render = () => {
                        const data = new Uint8Array(analyser.fftSize);
                        analyser.getByteTimeDomainData(data);

                        viz.render({
                            elapsedTime: 1 / 60,
                            audioLevels: {
                                timeByteArray: Array.from(data),
                                timeByteArrayL: Array.from(data),
                                timeByteArrayR: Array.from(data),
                            },
                        });

                        loops.current[idx] = requestAnimationFrame(render);
                    };

                    render();

                    initialized++;
                    if (initialized === currentKeys.length) setLoading(false);
                });
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        setup();

        return cleanupVisualizers;
    }, [currentKeys, mergedPresets]);

    // Pagination
    const nextPage = () => setPage((p) => (p < totalPages - 1 ? p + 1 : 0));
    const prevPage = () => setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
    const goToFirstPage = () => setPage(0);
    const goToLastPage = () => setPage(totalPages - 1);

    return (
        <div className="overview-container">
            <div className="overview-grid-wrapper">
                {loading && (
                    <div className="overview-loading-overlay">Loading presets...</div>
                )}

                <div className="overview-grid">
                    {currentKeys.map((key) => (
                        <div key={key} className="overview-canvas-wrapper">
                            <canvas
                                id={`preview-${key}`}
                                width={canvasWidth}
                                height={canvasHeight}
                                className="overview-canvas"
                                onClick={() =>
                                    navigate(`/visualizer/${encodeURIComponent(key)}`)
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="overview-pagination">
                <button onClick={goToFirstPage}>⏮ First</button>
                <button onClick={prevPage}>← Prev</button>

                <span className="overview-page-indicator">
                    Page {page + 1} of {totalPages}
                </span>

                <button onClick={nextPage}>Next →</button>
                <button onClick={goToLastPage}>Last ⏭</button>
            </div>
        </div>
    );
}