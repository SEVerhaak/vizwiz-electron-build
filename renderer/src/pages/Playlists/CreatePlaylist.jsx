import "./style/PlayListEditingPage.css";

import {useState, useEffect} from "react";
import Overview from "../Overview/Overview.jsx";
import SelectedVizItem from "./SelectedVizItem.jsx";
import {Link, useNavigate} from "react-router-dom";
import {GrFormNextLink} from "react-icons/gr";

import ErrorOverlay from "../../utils/Overlays/genericErrorOverlay.jsx";
import {setPlaylistMode} from "../../utils/playlistModeSwitcher.jsx";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

export default function CreatePlaylist() {
    setPlaylistMode("creating");

    const navigate = useNavigate();

    const [errorState, setErrorState] = useState(null);
    const [selectedViz, setSelectedViz] = useState([]);

    const [playlistName, setPlaylistName] =
        useState("My Playlist");

    useEffect(() => {
        const saved = localStorage.getItem("playlist_draft");

        if (saved) {
            const parsed = JSON.parse(saved);

            if (parsed?.presets) {
                setSelectedViz(parsed.presets);
                setPlaylistName(
                    parsed.name || "My Playlist"
                );
            }
        }
    }, []);

    const saveToLocalStorage = (presets) => {
        const playlist = {
            name: playlistName,
            creationTime: new Date().toISOString(),
            presets,
            settings: {},
        };

        localStorage.setItem(
            "playlist_draft",
            JSON.stringify(playlist)
        );
    };

    const removeViz = (key) => {
        setSelectedViz((prev) => {
            const updated = prev.filter(
                (item) => item !== key
            );

            const playlist = {
                name: playlistName,
                creationTime: new Date().toISOString(),
                presets: updated,
                settings: {},
            };

            localStorage.setItem(
                "playlist_draft",
                JSON.stringify(playlist)
            );

            return updated;
        });
    };

    const handleVizClick = (key) => {
        setSelectedViz((prev) => {
            if (prev.includes(key)) return prev;

            const updated = [key, ...prev];

            saveToLocalStorage(updated);

            return updated;
        });
    };

    return (
        <div className="edit-playlist-page">
            <h1>Create New Playlist</h1>

            <div className="columns-wrapper">
                {/* LEFT */}
                <div className="left-column">
                    <div className="left-header">
                        <h2 className="section-title">
                            Preset Overview
                        </h2>
                    </div>

                    <div className="overview-container">
                        <Overview
                            onVizClick={handleVizClick}
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="right-column">
                    <h2 className="selection-title">Selected Visualizers</h2>

                    <div className="right-box">
                        {selectedViz.length === 0 ? (
                            <p>
                                No visualizers selected yet
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

                    <div className="button-row">
                        <Link
                            to="/playlists"
                            className="playlist-button back-button"
                        >
                            <FaArrowLeft size={20}/>
                            Back
                        </Link>

                        <button
                            className="playlist-button next-button"
                            onClick={() => {
                                if (
                                    selectedViz.length === 0
                                ) {
                                    setErrorState({
                                        message:
                                            "You need to select at least one visualizer before continuing.",
                                        severity:
                                            "warning",
                                    });

                                    return;
                                }

                                navigate(
                                    "/playlists/settings"
                                );
                            }}
                        >
                            Next step
                            <FaArrowRight size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            {errorState && (
                <ErrorOverlay
                    message={errorState.message}
                    severity={errorState.severity}
                    onClose={() =>
                        setErrorState(null)
                    }
                />
            )}
        </div>
    );
}