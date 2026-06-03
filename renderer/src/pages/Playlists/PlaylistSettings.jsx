import {useEffect, useState} from "react";
import "../../App.css"
import SelectedVizItem from "./SelectedVizItem.jsx";
import {useNavigate} from "react-router-dom";
import PlaylistSavePopup from "./PlaylistPopUp.jsx";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import "./style/PlayListSettingsStyling.css";
import {getPlaylistMode} from "../../utils/playlistModeSwitcher.jsx";
import MicrophoneSelector from "../Settings/MicrophoneSelector.jsx";

export default function PlaylistSettingsPage() {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const mode = getPlaylistMode();

    let VISUALIZER_SETTINGS_KEY;

    useEffect(() =>{
        console.log(mode)
        if (mode === "creating"){
            VISUALIZER_SETTINGS_KEY = "vizwiz_settings_temp";
        } else if (mode === "editing"){
            try {
                const stored = localStorage.getItem("playlist_edit");

                if (!stored) return "Error occured check console for details!";

                const parsed = JSON.parse(stored);

                VISUALIZER_SETTINGS_KEY = "vizwiz_settings_" + parsed.name;

                console.log(VISUALIZER_SETTINGS_KEY)

            } catch (e) {

                VISUALIZER_SETTINGS_KEY = "vizwiz_settings_temp";
                console.log("An error occured trying to get the playlist name");
                console.error(e);
            }

        } else{
            console.warn("unknown mode")
        }
    })

    // start new stuff edit with proper settings per playlist

    const [presetCycle, setPresetCycle] = useState(true);
    const [presetCycleLength, setPresetCycleLength] = useState(15000);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(VISUALIZER_SETTINGS_KEY));
        if (saved) {
            if (typeof saved.presetCycle === "boolean") {
                setPresetCycle(saved.presetCycle);
            }
            if (typeof saved.presetCycleLength === "number") {
                setPresetCycleLength(saved.presetCycleLength);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            VISUALIZER_SETTINGS_KEY,
            JSON.stringify({
                presetCycle,
                presetCycleLength,
            })
        );
    }, [presetCycle, presetCycleLength]);

    // end new stuff edit with proper settings per playlist

    const storageKey =
        mode === "editing"
            ? "playlist_edit"
            : "playlist_draft";

    const [selectedViz, setSelectedViz] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return parsed?.presets || [];
        } catch (e) {
            return [];
        }
    });

    const removeViz = (key) => {
        setSelectedViz((prev) => {
            const updated = prev.filter((item) => item !== key);

            const saved = JSON.parse(localStorage.getItem(storageKey)) || {};

            const updatedPlaylist = {
                ...saved,
                presets: updated,
            };

            localStorage.setItem(storageKey, JSON.stringify(updatedPlaylist));

            return updated;
        });
    };

    return (
        <div className="playlist-page">

            <div className="playlist-layout">

                {/* RIGHT SIDE */}
                <div className="playlist-settings">
                    <h2 className="playlist-title">Playlist Settings</h2>
                    <div className="settings-box">
                        <h2 className={"vis-settings-title"}>Visualizer Settings</h2>

                        <div className="settings-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={presetCycle}
                                    onChange={() => setPresetCycle(!presetCycle)}
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
                                        setPresetCycleLength(parseInt(e.target.value, 10) || 0)
                                    }
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* LEFT SIDE */}
                <div className="playlist-preview">
                    {selectedViz.length === 0 ? (
                        <p className="empty-state">No visualizers selected</p>
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

            {/* BACK BUTTON */}
            <div className="button-row">
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate("/");
                        }
                    }}
                >
                    <FaArrowLeft/>
                    Back
                </button>

                {/* POPUP */}
                {showPopup && (
                    <PlaylistSavePopup
                        currentPresets={selectedViz}
                        onClose={() => setShowPopup(false)}
                    />
                )}

                {/* SAVE BUTTON */}
                <button
                    className="btn btn-success"
                    onClick={() => {
                        const mode = getPlaylistMode();

                        // Creating a new playlist
                        if (mode === "creating") {
                            setShowPopup(true);
                            return;
                        }

                        // Editing an existing playlist
                        if (mode === "editing") {
                            const draft = JSON.parse(
                                localStorage.getItem("playlist_edit") || "{}"
                            );

                            const playlistName = draft.name;

                            if (!playlistName) {
                                console.error(
                                    "No playlist name found in playlist_edit"
                                );
                                return;
                            }

                            const finalPlaylist = {
                                name: playlistName,
                                creationTime:
                                    draft.creationTime ||
                                    new Date().toISOString(),
                                presets: selectedViz,
                                settings: draft.settings || {},
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
                    }}
                >
                    <FaSave/>
                    Save Playlist
                </button>
            </div>
        </div>
    );
}