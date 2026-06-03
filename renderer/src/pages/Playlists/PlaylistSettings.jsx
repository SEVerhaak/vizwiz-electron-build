import { useEffect, useMemo, useState } from "react";
import "../../App.css";
import SelectedVizItem from "./SelectedVizItem.jsx";
import { useNavigate } from "react-router-dom";
import PlaylistSavePopup from "./PlaylistPopUp.jsx";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import "./style/PlayListSettingsStyling.css";
import { getPlaylistMode } from "../../utils/playlistModeSwitcher.jsx";
import MicrophoneSelector from "../Settings/MicrophoneSelector.jsx";

export default function PlaylistSettingsPage() {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const mode = getPlaylistMode();

    // -----------------------------
    // ✅ FIX: stable settings key
    // -----------------------------
    const VISUALIZER_SETTINGS_KEY = useMemo(() => {
        if (mode === "creating") {
            return "vizwiz_settings_temp";
        }

        if (mode === "editing") {
            try {
                const stored = localStorage.getItem("playlist_edit");
                if (!stored) return "vizwiz_settings_temp";

                const parsed = JSON.parse(stored);
                if (!parsed?.name) return "vizwiz_settings_temp";

                return `vizwiz_settings_${parsed.name}`;
            } catch (e) {
                console.error(e);
                return "vizwiz_settings_temp";
            }
        }

        return "vizwiz_settings_temp";
    }, [mode]);

    // -----------------------------
    // settings state
    // -----------------------------
    const [presetCycle, setPresetCycle] = useState(true);
    const [presetCycleLength, setPresetCycleLength] = useState(15000);

    // load settings
    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem(VISUALIZER_SETTINGS_KEY)
        );

        if (saved) {
            if (typeof saved.presetCycle === "boolean") {
                setPresetCycle(saved.presetCycle);
            }
            if (typeof saved.presetCycleLength === "number") {
                setPresetCycleLength(saved.presetCycleLength);
            }
        }
    }, [VISUALIZER_SETTINGS_KEY]);

    // save settings
    useEffect(() => {
        localStorage.setItem(
            VISUALIZER_SETTINGS_KEY,
            JSON.stringify({
                presetCycle,
                presetCycleLength,
            })
        );
    }, [presetCycle, presetCycleLength, VISUALIZER_SETTINGS_KEY]);

    // -----------------------------
    // playlist data
    // -----------------------------
    const storageKey =
        mode === "editing" ? "playlist_edit" : "playlist_draft";

    const [selectedViz, setSelectedViz] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return parsed?.presets || [];
        } catch {
            return [];
        }
    });

    const removeViz = (key) => {
        setSelectedViz((prev) => {
            const updated = prev.filter((item) => item !== key);

            const saved =
                JSON.parse(localStorage.getItem(storageKey)) || {};

            const updatedPlaylist = {
                ...saved,
                presets: updated,
            };

            localStorage.setItem(
                storageKey,
                JSON.stringify(updatedPlaylist)
            );

            return updated;
        });
    };

    // -----------------------------
    // SAVE PLAYLIST
    // -----------------------------
    const handleSave = () => {
        const mode = getPlaylistMode();

        // CREATE NEW
        if (mode === "creating") {
            setShowPopup(true);
            return;
        }

        // EDIT EXISTING
        if (mode === "editing") {
            const draft = JSON.parse(
                localStorage.getItem("playlist_edit") || "{}"
            );

            const playlistName = draft.name;

            if (!playlistName) {
                console.error("No playlist name found");
                return;
            }

            const finalPlaylist = {
                name: playlistName,
                creationTime:
                    draft.creationTime || new Date().toISOString(),
                presets: selectedViz,

                // 🔥 FIX: ALWAYS save CURRENT settings
                settings: JSON.parse(
                    localStorage.getItem(VISUALIZER_SETTINGS_KEY) || "{}"
                ),
            };

            localStorage.setItem(
                `playlist_${playlistName}`,
                JSON.stringify(finalPlaylist)
            );

            localStorage.setItem(
                "playlist_edit",
                JSON.stringify(finalPlaylist)
            );

            navigate("/playlists");
            return;
        }

        console.error("Invalid playlist mode:", mode);
    };

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <div className="playlist-page">
            <div className="playlist-layout">
                {/* RIGHT SIDE */}
                <div className="playlist-settings">
                    <h2 className="playlist-title">
                        Playlist Settings
                    </h2>

                    <div className="settings-box">
                        <h2 className="vis-settings-title">
                            Visualizer Settings
                        </h2>

                        <div className="settings-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={presetCycle}
                                    onChange={() =>
                                        setPresetCycle(!presetCycle)
                                    }
                                />
                                Enable Preset Cycling
                            </label>
                        </div>

                        <div className="settings-row">
                            <label>
                                Preset Cycle Length (ms):
                                <input
                                    type="number"
                                    value={presetCycleLength}
                                    onChange={(e) =>
                                        setPresetCycleLength(
                                            parseInt(e.target.value, 10) ||
                                            0
                                        )
                                    }
                                />
                            </label>
                        </div>

                        <MicrophoneSelector />
                    </div>
                </div>

                {/* LEFT SIDE */}
                <div className="playlist-preview">
                    {selectedViz.length === 0 ? (
                        <p className="empty-state">
                            No visualizers selected
                        </p>
                    ) : (
                        selectedViz.map((item) => (
                            <SelectedVizItem
                                key={item}
                                name={item}
                                onRemove={removeViz}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* BACK / SAVE */}
            <div className="button-row">
                <button
                    className="btn btn-danger"
                    onClick={() =>
                        window.history.length > 1
                            ? navigate(-1)
                            : navigate("/")
                    }
                >
                    <FaArrowLeft />
                    Back
                </button>

                {showPopup && (
                    <PlaylistSavePopup
                        currentPresets={selectedViz}
                        onClose={() => setShowPopup(false)}
                    />
                )}

                <button
                    className="btn btn-success"
                    onClick={handleSave}
                >
                    <FaSave />
                    Save Playlist
                </button>
            </div>
        </div>
    );
}