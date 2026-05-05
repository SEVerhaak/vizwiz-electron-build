import React, { useEffect, useState, useRef, useMemo } from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";
import extraPresets from "butterchurn-presets/lib/butterchurnPresetsExtra.min.js";
import extraPresets2 from "butterchurn-presets/lib/butterchurnPresetsExtra2.min.js";
import presetsNonMinimal from "butterchurn-presets/lib/butterchurnPresetsNonMinimal.min.js";
import presetsMD1 from "butterchurn-presets/lib/butterchurnPresetsMD1.min.js";
import { useLocation } from "react-router-dom";
import "./Overview.css";

const butterchurnLib = butterchurn.default || butterchurn;

const allPacks = {
    Default: butterchurnPresets.getPresets(),
    Extra: extraPresets.getPresets(),
    Extra2: extraPresets2.getPresets(),
    NonMinimal: presetsNonMinimal.getPresets(),
    MD1: presetsMD1.getPresets(),
};

export default function Overview() {
    const location = useLocation();

    const presetsPerPage = 6;

    const [selectedPacks, setSelectedPacks] = useState(["Default"]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const canvasRefs = useRef({});
    const vizRefs = useRef([]);
    const loops = useRef([]);
    const analyserRef = useRef(null);

    const setupId = useRef(0);

    const canvasWidth = 640;
    const canvasHeight = 360;

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

    useEffect(() => {
        if (location.state?.refresh) {
            loadPacks();
        }
    }, [location.state]);

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

    const presetKeys = useMemo(
        () => Object.keys(mergedPresets),
        [mergedPresets]
    );

    const totalPages = Math.ceil(presetKeys.length / presetsPerPage);

    useEffect(() => {
        setPage(0);
    }, [presetKeys.length]);

    const currentKeys = useMemo(() => {
        const start = page * presetsPerPage;
        return presetKeys.slice(start, start + presetsPerPage);
    }, [page, presetKeys]);

    const cleanupVisualizers = () => {
        loops.current.forEach((id) => cancelAnimationFrame(id));
        loops.current = [];

        vizRefs.current.forEach((viz) => {
            try {
                if (viz?.gl) {
                    const ext = viz.gl.getExtension("WEBGL_lose_context");
                    ext?.loseContext();
                }
            } catch {}
        });

        vizRefs.current = [];
    };

    useEffect(() => {
        return cleanupVisualizers;
    }, []);

    useEffect(() => {
        const id = ++setupId.current;

        cleanupVisualizers();
        setLoading(true);

        let stream;
        let audioContext;
        let analyser;

        const setup = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);

                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;

                source.connect(analyser);
                analyserRef.current = analyser;

                const localVizRefs = [];
                const localLoops = [];

                currentKeys.forEach((key, idx) => {
                    const canvas = canvasRefs.current[key];
                    if (!canvas) return;

                    const viz = butterchurnLib.createVisualizer(audioContext, canvas, {
                        width: canvasWidth,
                        height: canvasHeight,
                    });

                    viz.loadPreset(mergedPresets[key], 0);
                    localVizRefs.push(viz);

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

                        localLoops[idx] = requestAnimationFrame(render);
                    };

                    render();
                });

                if (setupId.current !== id) {
                    localLoops.forEach(cancelAnimationFrame);

                    localVizRefs.forEach((viz) => {
                        try {
                            viz?.gl
                                ?.getExtension("WEBGL_lose_context")
                                ?.loseContext();
                        } catch {}
                    });

                    stream?.getTracks().forEach((t) => t.stop());
                    audioContext?.close();
                    return;
                }

                vizRefs.current = localVizRefs;
                loops.current = localLoops;

                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        setup();

        return () => {
            setupId.current++;

            cleanupVisualizers();

            stream?.getTracks().forEach((t) => t.stop());
            audioContext?.close?.();
        };
    }, [currentKeys, mergedPresets]);

    const nextPage = () =>
        setPage((p) => (p < totalPages - 1 ? p + 1 : 0));
    const prevPage = () =>
        setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
    const goToFirstPage = () => setPage(0);
    const goToLastPage = () => setPage(totalPages - 1);

    return (
        <div className="overview-container">
            <div className="overview-grid-wrapper">
                {loading && (
                    <div className="overview-loading-overlay">
                        Loading presets...
                    </div>
                )}

                <div className="overview-grid">
                    {currentKeys.map((key) => (
                        <div key={key} className="overview-canvas-wrapper">
                            <canvas
                                ref={(el) => {
                                    if (el) canvasRefs.current[key] = el;
                                }}
                                width={canvasWidth}
                                height={canvasHeight}
                                className="overview-canvas"
                                onClick={() => console.log(key)}
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