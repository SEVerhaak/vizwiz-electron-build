import { Link } from "react-router-dom";
import { IoPlayCircle } from "react-icons/io5";
import { TbPlaylistAdd } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";

import App from "../../App.jsx";
// import "./Home.css"; // optional for styling
{/*<Link to="/editor" style={linkStyle}>Editor (coming soon)</Link>*/}

export default function Home() {
    return (

            <div className={"mainMenuContainer"} style={mainMenuContainerStyle}>
                <div  className={"title"} style={titleStyle}>
                    <p>VizWiz</p>
                </div>
                <div className={"mainButtonContainer"} style={mainButtonContainerStyle}>
                    <nav style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <Link
                            to="/visualizer"
                            style={{ textDecoration: "none", color: "inherit" }}
                            onClick={() => {
                                // discard any active playlist session
                                localStorage.removeItem("playlists_current");
                            }}
                        >
                            <div className="mainMenuButton" style={mainMenuButtonStyle}>
                                <IoPlayCircle size={96} />
                                <div style={linkStyle}>Start the visualizer</div>
                            </div>
                        </Link>
                        <Link to="/playlists" style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="mainMenuButton" style={mainMenuButtonStyle}>
                                <TbPlaylistAdd size={96} />
                                <div style={linkStyle}>Load a playlist</div>
                            </div>
                        </Link>
                    </nav>
                </div>
                <div className={"auxiliaryButtonContainer"} style={auxiliaryButtonContainerStyle}>
                    <nav>
                        <Link to="/settings" style={settingsButtonStyle}>
                            <VscSettings size={20} />
                            Settings
                        </Link>
                    </nav>
                </div>
            </div>
    );
}

const mainMenuContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    color: "white",
    fontFamily: '"poppins-thin", sans-serif',
    fontWeight: 700,
    fontStyle: "normal"
}

const titleStyle = {
    marginLeft: "5rem",
    fontSize: "48px"
}

const mainButtonContainerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "5rem",
    alignSelf: "center",
}

const auxiliaryButtonContainerStyle = {
    marginLeft: "5rem",
}

const mainMenuButtonStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    alignItems: "center",
    justifyContent: "center",

    width: "300px",
    height: "300px",
    aspectRatio: "1 / 1",

    padding: "20px",
    borderRadius: "10px",

    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    cursor: "pointer",
    transition: "0.2s ease",
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    textAlign: "center",
    minWidth: "150px",

    fontSize: "25px",
    lineHeight: "1.3",

    whiteSpace: "normal",   // allows wrapping
    wordWrap: "break-word", // breaks long words
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

