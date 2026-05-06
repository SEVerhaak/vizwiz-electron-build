import {useState} from "react";
import SelectedVizItem from "./SelectedVizItem.jsx";
import { Link } from "react-router-dom";
import PlaylistSavePopup from "./PlaylistPopUp.jsx";
import { useNavigate } from "react-router-dom";

export default function PlaylistSettingsPage() {
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    const mode = localStorage.getItem("playlist_mode");
    const storageKey = mode === "editing" ? "playlist_edit" : "playlist_draft";

    const [selectedViz, setSelectedViz] = useState(() => {


        console.log(storageKey)

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

    // Layout
    const pageStyle = {
        display: "flex",
        height: "80vh",
        width: "100%",
        flexDirection: "row-reverse",
        justifyContent: "space-around"
    };

    // LEFT (settings)
    const leftStyle = {
        width: "60%",
        padding: "20px",
        overflowY: "auto",
        borderRight: "1px solid #ddd",
    };

    const settingBlockStyle = {
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    };

    const inputStyle = {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    };

    // RIGHT (playlist column)
    const rightStyle = {
        width: "30%",
        padding: "20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
    };

    const contentContainerStyle = {
        maxHeight: "80%",
    }

    return (
        <div>
            <div style={pageStyle}>
                {/* LEFT SIDE - SETTINGS */}
                <div style={leftStyle}>
                    <h2>Settings</h2>

                    <div style={settingBlockStyle}>
                        <label>Playlist Name - Setting Input</label>
                        <input style={inputStyle} placeholder="Enter name..."/>
                    </div>

                    <div style={settingBlockStyle}>
                        <label>Audio Quality - Setting Input</label>
                        <input style={inputStyle} placeholder="High / Medium / Low"/>
                    </div>

                    <div style={settingBlockStyle}>
                        <label>Theme Mode - Setting Input</label>
                        <input style={inputStyle} placeholder="Dark / Light"/>
                    </div>

                    <div style={settingBlockStyle}>
                        <label>Playback Speed - Setting Input</label>
                        <input style={inputStyle} placeholder="1.0x"/>
                    </div>

                    {/* filler scroll content */}
                    {Array.from({length: 20}).map((_, i) => (
                        <div key={i} style={settingBlockStyle}>
                            <label>Extra Setting {i + 1} - Setting Input</label>
                            <input style={inputStyle} placeholder="..."/>
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDE - PLAYLIST */}
                <div style={rightStyle}>
                    {selectedViz.length === 0 ? (
                        <p>No visualizers selected</p>
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
            {/* Back button */}
            <button
                onClick={() => {
                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate("/"); // fallback route
                    }
                }}
                style={{
                    marginTop: "20px",
                    display: "block",
                    padding: "10px",
                    width: "100%",
                    textAlign: "center",
                    background: "#eee",
                    color: "black",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                ← Back
            </button>

            {showPopup && (
                <PlaylistSavePopup
                    currentPresets={selectedViz}
                    onClose={() => setShowPopup(false)}
                />
            )}

            <button
                onClick={() => {
                    const mode = localStorage.getItem("playlist_mode");

                    if (mode === "creating"){
                        // creating mode → keep popup flow
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
                        // overwrite real saved playlist
                        const storageKey = `playlist_${playlistName}`;
                        localStorage.setItem(storageKey, JSON.stringify(finalPlaylist));

                        // keep draft in sync (optional but safe)
                        localStorage.setItem("playlist_edit", JSON.stringify(finalPlaylist));

                        // go back to overview
                        navigate("/playlists");

                        return;
                    }
                }}
            >
                Save Playlist
            </button>
        </div>

    );
}