import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import {VscSettings} from "react-icons/vsc";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PlaylistPage() {
    const navigate = useNavigate();

    const [playlists, setPlaylists] = useState([]);
    const [selected, setSelected] = useState("");

    const presetAmount = (() => {
        try {
            const raw = localStorage.getItem("playlist_edit");
            if (!raw) return 0;

            const parsed = JSON.parse(raw);
            return parsed?.presets?.length || 0;
        } catch (e) {
            return 0;
        }
    })();

    const mic = (() => {
        try {
            const raw = localStorage.getItem("settings_mic");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem("playlist_list")) || [];
        setPlaylists(list);

        const editRaw = localStorage.getItem("playlist_edit");

        if (editRaw) {
            try {
                const editParsed = JSON.parse(editRaw);

                if (editParsed.name && list.includes(editParsed.name)) {
                    setSelected(editParsed.name);
                    return; // stop here, we found the correct one
                }
            } catch (e) {
                console.error("Failed to parse playlist_edit", e);
            }
        }

        // fallback logic if no valid playlist_edit
        if (list.length === 1) {
            const onlyPlaylist = list[0];
            setSelected(onlyPlaylist);

            const playlistKey = `playlist_${onlyPlaylist}`;
            const saved = localStorage.getItem(playlistKey);

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    const draft = {
                        name: parsed.name,
                        creationTime: parsed.creationTime,
                        presets: parsed.presets || [],
                        settings: parsed.settings || {},
                    };

                    localStorage.setItem("playlist_edit", JSON.stringify(draft));
                } catch (e) {
                    console.error("Failed to load single playlist", e);
                }
            }
        } else if (list.length > 1) {
            setSelected(list[0]);
        }
    }, []);
    const handleSelect = (name) => {
        setSelected(name);

        const playlistKey = `playlist_${name}`;
        const saved = localStorage.getItem(playlistKey);

        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);

            const draft = {
                name: parsed.name,
                creationTime: parsed.creationTime,
                presets: parsed.presets || [],
                settings: parsed.settings || {},
            };

            localStorage.setItem("playlist_edit", JSON.stringify(draft));
        } catch (e) {
            console.error("Failed to load playlist", e);
        }
    };

    return (
        <div style={pageStyle}>

            {/* Title */}
            <h1 style={titleStyle}>Audiovizwiz Select Playlist</h1>

            {/* Dropdown Title */}
            <h3 style={sectionTitleStyle}>Current Player Settings</h3>

            {/* Dropdown */}
            <select
                style={dropdownStyle}
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
            {/* Information Box */}
            <div style={infoBoxStyle}>
                <p>PRESET AMOUNT: {presetAmount}</p>
                <p>RANDOMIZE ORDER:</p>
                <p>CYCLE BETWEEN PRESETS:</p>
                <p>INPUT: {mic?.name || "Default Microphone"}</p>
                <p>INPUT LEVEL:</p>
            </div>

            {/* Buttons Row 1 */}
            <div style={buttonRowStyle}>
                <button
                    style={primaryButtonStyle}
                    onClick={() => {
                        const editRaw = localStorage.getItem("playlist_edit");

                        if (!editRaw) return;

                        try {
                            const parsed = JSON.parse(editRaw);

                            if (!parsed?.presets || parsed.presets.length === 0) {
                                console.warn("No presets in playlist_edit");
                                return;
                            }

                            // save runtime playlist
                            localStorage.setItem(
                                "playlists_current",
                                JSON.stringify({
                                    name: parsed.name,
                                    presets: parsed.presets,
                                    settings: parsed.settings || {},
                                    creationTime: parsed.creationTime,
                                })
                            );

                            // go to visualizer (no presetKey)
                            navigate("/visualizer");
                        } catch (e) {
                            console.error("Failed to start visualizer", e);
                        }
                    }}
                >
                    Start Visualizer
                </button>
                {selected && playlists.length > 0 && (
                    <Link to="/playlists/edit" style={secondaryButtonStyle}>
                        <FaEdit size={20} />
                        Edit Playlist
                    </Link>

                )}
                <Link to="/playlists/create" style={secondaryButtonStyle}>
                    <FaPlus size={20} />
                    Create Playlist
                </Link>
            </div>

            {/* Buttons Row 2 (bottom actions) */}
            <div style={bottomRowStyle}>
                <Link to="/" style={dangerButtonStyle}>
                    <IoArrowBackOutline size={20} />
                    Back
                </Link>
                <Link to="/settings" style={settingsButtonStyle}>
                    <VscSettings size={20} />
                    Settings
                </Link>
            </div>

        </div>
    );
}

const pageStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "50px",
    backgroundColor: "#1a1a1a",
    color: "white",
    gap: "20px",
    fontFamily: '"poppins-thin", sans-serif',
    fontWeight: 700,
    fontStyle: "normal",
    alignItems:"flex-start"
};

const titleStyle = {
    fontFamily: '"poppins-thin", sans-serif',
    fontSize: "42px",
    margin: 0
};

const sectionTitleStyle = {
    fontFamily: '"poppins-thin", sans-serif',
    letterSpacing: "3px",
    fontWeight: "600",
    marginTop: "80px",
    marginBottom: "0"
};

const dropdownStyle = {
    fontFamily: '"poppins-thin", sans-serif',
    padding: "10px",
    width: "50%",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px"
};

const infoBoxStyle = {
    marginTop: "10px",
    padding: "15px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "8px",
    lineHeight: "1.8",
    textAlign: "left",
    width: "50%"
};

const buttonRowStyle = {
    display: "flex",
    gap: "15px",
    marginTop: "10px"
};

const bottomRowStyle = {
    display: "flex",
    gap: "15px",
    marginTop: "auto" // pushes to bottom
};

const primaryButtonStyle = {
    fontFamily: '"poppins-thin", sans-serif',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
border: "none",

    padding: "12px 20px",
    borderRadius: "8px",

    backgroundColor: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",

    color: "white",
    textDecoration: "none",

    fontSize: "18px",

    cursor: "pointer",
    transition: "0.2s ease",
};

const secondaryButtonStyle = {
    fontFamily: '"poppins-thin", sans-serif',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "none",

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

const dangerButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",

    padding: "12px 20px",
    borderRadius: "8px",

    backgroundColor: "rgba(250,0,0,0.36)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",

    color: "white",
    textDecoration: "none",

    fontSize: "18px",

    cursor: "pointer",
    transition: "0.2s ease",
};

const settingsButtonStyle = {
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

