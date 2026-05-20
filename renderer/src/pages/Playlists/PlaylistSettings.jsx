import { useState } from "react";
import SelectedVizItem from "./SelectedVizItem.jsx";
import { Link, useNavigate } from "react-router-dom";
import PlaylistSavePopup from "./PlaylistPopUp.jsx";
import "./style/PlayListSettingsStyling.css";

export default function PlaylistSettingsPage() {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const mode = localStorage.getItem("playlist_mode");
    const storageKey = mode === "editing" ? "playlist_edit" : "playlist_draft";

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

                {/* LEFT SIDE */}
                <div className="playlist-settings">
                    <h2 className="playlist-title">Settings</h2>

                    <div className="setting-block">
                        <label>Playlist Name - Setting Input</label>
                        <input className="setting-input" placeholder="Enter name..." />
                    </div>

                    <div className="setting-block">
                        <label>Audio Quality - Setting Input</label>
                        <input className="setting-input" placeholder="High / Medium / Low" />
                    </div>

                    <div className="setting-block">
                        <label>Theme Mode - Setting Input</label>
                        <input className="setting-input" placeholder="Dark / Light" />
                    </div>

                    <div className="setting-block">
                        <label>Playback Speed - Setting Input</label>
                        <input className="setting-input" placeholder="1.0x" />
                    </div>

                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="setting-block">
                            <label>Extra Setting {i + 1}</label>
                            <input className="setting-input" placeholder="..." />
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE */}
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
            <button
                className="back-button"
                onClick={() => {
                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate("/");
                    }
                }}
            >
                ← Back
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
                className="save-button"
                onClick={() => {
                    const mode = localStorage.getItem("playlist_mode");

                    if (mode === "creating") {
                        setShowPopup(true);
                    }

                    const draft = JSON.parse(
                        localStorage.getItem("playlist_edit") || "{}"
                    );

                    const playlistName = draft.name;

                    if (!playlistName) {
                        console.error("No playlist name found in playlist_edit");
                        return;
                    }

                    const finalPlaylist = {
                        name: playlistName,
                        creationTime: draft.creationTime || new Date().toISOString(),
                        presets: selectedViz,
                        settings: draft.settings || {},
                    };

                    if (mode === "editing") {
                        const storageKey = `playlist_${playlistName}`;
                        localStorage.setItem(storageKey, JSON.stringify(finalPlaylist));
                        localStorage.setItem("playlist_edit", JSON.stringify(finalPlaylist));

                        navigate("/playlists");
                    }
                }}
            >
                Save Playlist
            </button>

        </div>
    );
}