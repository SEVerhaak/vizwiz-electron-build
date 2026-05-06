import { useState } from "react";
import Overview from "../Overview/Overview.jsx";
import SelectedVizItem from "./SelectedVizItem.jsx";
import {Link} from "react-router-dom";
import {VscSettings} from "react-icons/vsc";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import ErrorOverlay from "../../utils/Overlays/genericErrorOverlay.jsx";
import {setPlaylistMode} from "../../utils/playlistModeSwitcher.jsx"; // adjust path

export default function EditPlaylist() {
    setPlaylistMode("editing");

    const navigate = useNavigate();
    const [errorState, setErrorState] = useState(null);

    const [selectedViz, setSelectedViz] = useState([]);

    const [playlistName, setPlaylistName] = useState(() => {
        try {
            const stored = localStorage.getItem("playlist_edit");
            if (!stored) return "My Playlist";

            const parsed = JSON.parse(stored);
            return parsed.name || "My Playlist";
        } catch (e) {
            return "My Playlist";
        }
    });



    const saveToLocalStorage = (presets) => {
        const playlist = {
            name: playlistName,
            creationTime: new Date().toISOString(),
            presets: presets,
            settings: {},
        };

        localStorage.setItem("playlist_edit", JSON.stringify(playlist));
    };

    const removeViz = (key) => {
        setSelectedViz((prev) => {
            const updated = prev.filter((item) => item !== key);

            const playlist = {
                name: playlistName,
                creationTime: new Date().toISOString(),
                presets: updated,
                settings: {},
            };

            localStorage.setItem("playlist_edit", JSON.stringify(playlist));

            return updated;
        });
    };

    const handleVizClick = (key) => {
        setSelectedViz((prev) => {
            if (prev.includes(key)) return prev;

            const updated = [...prev, key];

            saveToLocalStorage(updated);

            return updated;
        });
    };



    // Layout
    const pageStyle = { padding: "20px" };

    const columnsWrapperStyle = {
        display: "flex",
        justifyContent: "space-between",
        gap: "10%",
        width: "100%",
        marginTop: "20px",
    };

    const leftColumnStyle = { width: "60%" };

    const leftHeaderStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    };

    const overviewContainerStyle = { height: "600px" };

    const filterButtonStyle = {
        padding: "6px 12px",
        cursor: "pointer",
    };

    const rightColumnStyle = { width: "30%" };

    const rightBoxStyle = {
        border: "1px solid #ccc",
        height: "600px",
        padding: "10px",
        overflowY: "auto",
    };

    const nextButtonStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",

        padding: "12px 20px",
        borderRadius: "8px",

        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",

        color: "white",
        textDecoration: "none",

        fontSize: "18px",

        cursor: "pointer",
        transition: "0.2s ease",
    };

    useState(() => {
        const saved = localStorage.getItem("playlist_edit");

        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.presets) {
                setSelectedViz(parsed.presets);
                setPlaylistName(parsed.name || "My Playlist");
            }
        }
    }, []);

    return (
        <div style={pageStyle}>
            <h1>EDIT PLAYLIST</h1>
            <h1>Playlist name: {playlistName}</h1>

            <div style={columnsWrapperStyle}>
                {/* LEFT */}
                <div style={leftColumnStyle}>
                    <div style={leftHeaderStyle}>
                        <h2 style={{ margin: 0 }}>Overview</h2>

                        <button style={filterButtonStyle}>Filter</button>
                    </div>

                    <div style={overviewContainerStyle}>
                        <Overview onVizClick={handleVizClick} />
                    </div>
                </div>

                {/* RIGHT */}
                <div style={rightColumnStyle}>
                    <h2>Selected Visualizers</h2>

                    <div style={rightBoxStyle}>
                        {selectedViz.length === 0 ? (
                            <p>No visualizers selected yet</p>
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
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                        }}
                    >
                        {/* Back button (Link) */}
                        <Link
                            to="/playlists"
                            style={{
                                ...nextButtonStyle,
                                backgroundColor: "rgba(255,255,255,0.05)",
                            }}
                        >
                            ← Back
                        </Link>

                        {/* Next button (controlled) */}
                        <button
                            style={nextButtonStyle}
                            onClick={() => {
                                if (selectedViz.length === 0) {
                                    setErrorState({
                                        message:
                                            "You need to select at least one visualizer before continuing.",
                                        severity: "warning",
                                    });
                                    return;
                                }

                                navigate("/playlists/settings");
                            }}
                        >
                            <GrFormNextLink size={20} />
                            Next step
                        </button>
                    </div>
                </div>
            </div>
            {errorState && (
                <ErrorOverlay
                    message={errorState.message}
                    severity={errorState.severity}
                    onClose={() => setErrorState(null)}
                />
            )}
        </div>
    );
}