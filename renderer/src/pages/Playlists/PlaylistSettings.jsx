import {useState} from "react";
import SelectedVizItem from "./SelectedVizItem.jsx";
import {useNavigate} from "react-router-dom";
import PlaylistSavePopup from "./PlaylistPopUp.jsx";
import {FaArrowLeft, FaSave} from "react-icons/fa";
import "./style/PlayListSettingsStyling.css";
import {getPlaylistMode} from "../../utils/playlistModeSwitcher.jsx";

export default function PlaylistSettingsPage() {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const mode = getPlaylistMode();

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

                {/* LEFT SIDE */}
                <div className="playlist-settings">
                    <h2 className="playlist-title">Settings</h2>
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
            <div className="button-row">
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
                    className="save-button"
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