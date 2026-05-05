import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeDraftPlaylist } from "../../utils/removeDraftPlaylist.jsx";

export default function PlaylistSavePopup({ onClose, currentPresets = [] }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [name, setName] = useState("");

    const savePlaylist = () => {
        setError(""); // reset previous error

        if (!name.trim()) {
            setError("Please enter a playlist name.");
            return;
        }

        if (currentPresets.length === 0) {
            setError("Your playlist is empty. Add at least one visualizer.");
            return;
        }

        const existingList =
            JSON.parse(localStorage.getItem("playlist_list")) || [];

        if (existingList.includes(name)) {
            setError("A playlist with this name already exists.");
            return;
        }

        const playlistKey = `playlist_${name}`;

        const playlist = {
            name,
            creationTime: new Date().toISOString(),
            presets: currentPresets,
            settings: {},
        };

        // Save playlist
        localStorage.setItem(playlistKey, JSON.stringify(playlist));

        // Update master list
        const updatedList = [...existingList, name];
        localStorage.setItem("playlist_list", JSON.stringify(updatedList));

        // remove draft after successful save
        removeDraftPlaylist();

        // Navigate after saving
        navigate("/playlists");
    };    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <h3>Save Playlist</h3>

                {error && (
                    <div
                        style={{
                            background: "#ffe0e0",
                            color: "#b00020",
                            padding: "8px",
                            borderRadius: "4px",
                            fontSize: "14px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Playlist name..."
                    style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={onClose}>Back</button>
                    <button onClick={savePlaylist}>Save</button>
                </div>
            </div>
        </div>
    );
}