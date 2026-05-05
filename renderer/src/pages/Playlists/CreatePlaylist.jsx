import { useState } from "react";
import Overview from "../Overview/Overview.jsx";
import SelectedVizItem from "./SelectedVizItem.jsx";

export default function CreatePlaylist() {
    const [selectedViz, setSelectedViz] = useState([]);

    const [playlistName, setPlaylistName] = useState("My Playlist");

    const saveToLocalStorage = (presets) => {
        const playlist = {
            name: playlistName,
            creationTime: new Date().toISOString(),
            presets: presets,
            settings: {},
        };

        localStorage.setItem("playlist_draft", JSON.stringify(playlist));
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

            localStorage.setItem("playlist_draft", JSON.stringify(playlist));

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
        marginTop: "10px",
        width: "100%",
        padding: "10px",
        cursor: "pointer",
    };

    useState(() => {
        const saved = localStorage.getItem("playlist_draft");

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
            <h1>CREATE NEW PLAYLIST</h1>

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

                    <button style={nextButtonStyle}>
                        Next step
                    </button>
                </div>
            </div>
        </div>
    );
}