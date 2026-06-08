import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {VscSettings} from "react-icons/vsc";
import {IoArrowBackOutline} from "react-icons/io5";
import {FaPlus, FaPlay, FaEdit, FaTrashAlt} from "react-icons/fa";
import {IoMdArrowRoundBack} from "react-icons/io";
import ChoiceOverlay from "../../utils/Overlays/genericChoiceOverlay.jsx";

import "./style/PlayListOverviewStyling.css";
import "../../App.css"
import {GradFlow, PRESETS} from "gradflow";

export default function PlaylistPage() {
    const navigate = useNavigate();

    const [showOverlay, setShowOverlay] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selected, setSelected] = useState("");
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [playlistSettings, setPlaylistSettings] = useState(null);

    const loadPlaylist = (name) => {
        if (!name) return null;

        try {
            const raw = localStorage.getItem(`playlist_${name}`);
            if (!raw) return null;

            localStorage.setItem(`playlist_edit`, raw);

            const parsed = JSON.parse(raw);
            setPlaylistSettings(parsed.settings || {});
            console.log(parsed.settings);
            setCurrentPlaylist(parsed);
            return parsed;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
        const list =
            JSON.parse(localStorage.getItem("playlist_list")) || [];

        setPlaylists(list);

        if (list.length > 0) {
            const first = list[0];
            setSelected(first);
            loadPlaylist(first);
        }
    }, []);

    const handleSelect = (name) => {
        setSelected(name);
        loadPlaylist(name);
    };

    const handleResult = (accepted) => {
        setShowOverlay(false);

        if (!accepted || !selected) return;

        try {
            const currentList =
                JSON.parse(localStorage.getItem("playlist_list")) || [];

            const updatedList = currentList.filter(
                (p) => p !== selected
            );

            localStorage.removeItem(`playlist_${selected}`);

            localStorage.setItem(
                "playlist_list",
                JSON.stringify(updatedList)
            );

            setPlaylists(updatedList);

            if (updatedList.length > 0) {
                const next = updatedList[0];
                setSelected(next);
                loadPlaylist(next);
            } else {
                setSelected("");
                setCurrentPlaylist(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const presetAmount =
        currentPlaylist?.presets?.length || 0;

    const mic = (() => {
        try {
            const raw = localStorage.getItem("settings_mic");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    return (
        <div>
            <div className="background">
                <GradFlow config={PRESETS.mystic} />
            </div>

            <div className="playlist-overview-page">

                <h1 className="playlist-title">
                    Select your playlist
                </h1>

                <h3 className="playlist-section-title">
                    Current Player Settings
                </h3>

                <select
                    className="playlist-dropdown"
                    value={selected}
                    onChange={(e) => handleSelect(e.target.value)}
                >
                    {playlists.length === 0 ? (
                        <option>No playlists found</option>
                    ) : (
                        playlists.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))
                    )}
                </select>

                <div className="playlist-info-box">
                    <p>PRESET AMOUNT: {presetAmount}</p>

                    <p>
                        CYCLE BETWEEN PRESETS:{" "}
                        {playlistSettings?.presetCycle ? "ON" : "OFF"}
                    </p>

                    <p>
                        CYCLE LENGTH:{" "}
                        {playlistSettings?.presetCycleLength
                            ? `${playlistSettings.presetCycleLength} ms`
                            : "Default"}
                    </p>

                    <p>INPUT: {mic?.name || "Default Microphone"}</p>
                </div>

                <div className={'top-btn-row'}>
                    {selected && playlists.length > 0 && (
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                if (!currentPlaylist) return;

                                localStorage.setItem(
                                    "playlists_current",
                                    JSON.stringify(currentPlaylist)
                                );

                                navigate("/visualizer");
                            }}
                        >
                            <FaPlay size={20}/>
                            Start Visualizer
                        </button>
                    )}

                    <Link
                        to="/playlists/create"
                        className="btn btn-primary"
                    >
                        <FaPlus size={20}/>
                        Create New Playlist
                    </Link>
                </div>

                <div className="playlist-button-row">

                    {selected && playlists.length > 0 && (
                        <Link
                            to="/playlists/edit"
                            className="btn btn-info"
                        >
                            <FaEdit size={20}/>
                            Edit Playlist
                        </Link>
                    )}

                    {selected && playlists.length > 0 && (
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowOverlay(true)}
                        >
                            <FaTrashAlt size={20}/>
                            Delete Playlist
                        </button>
                    )}

                    {showOverlay && (
                        <ChoiceOverlay
                            message="Are you sure you want to delete this item?"
                            severity="error"
                            acceptText="Delete"
                            rejectText="Cancel"
                            onChoice={handleResult}
                        />
                    )}
                </div>

                <div className="playlist-bottom-row">
                    <Link to="/" className="btn btn-secondary">
                        <IoMdArrowRoundBack size={20}/>
                        Back
                    </Link>

                    <Link
                        to="/settings"
                        className="btn btn-primary"
                    >
                        <VscSettings size={20}/>
                        Settings
                    </Link>
                </div>

            </div>
        </div>
    );
}