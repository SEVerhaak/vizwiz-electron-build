import { Link } from "react-router-dom";
import { IoPlayCircle } from "react-icons/io5";
import { TbPlaylistAdd } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";

import "./style/Home.css";
import "../../App.css"
export default function Home() {
    return (
        <div className="main-menu-container">
            <div className="title">
                <p>VizWiz</p>
            </div>

            <div className="main-button-container">
                <nav className="main-nav">
                    <Link
                        to="/visualizer"
                        className="menu-link"
                        onClick={() => {
                            localStorage.removeItem("playlists_current");
                        }}
                    >
                        <div className="main-menu-button">
                            <IoPlayCircle size={96} />
                            <div className="menu-button-text">
                                Start the visualizer
                            </div>
                        </div>
                    </Link>

                    <Link to="/playlists" className="menu-link">
                        <div className="main-menu-button">
                            <TbPlaylistAdd size={96} />
                            <div className="menu-button-text">
                                Load a playlist
                            </div>
                        </div>
                    </Link>
                </nav>
            </div>

            <div className="auxiliary-button-container">
                <nav>
                    <Link to="/settings" className="btn btn-primary">
                        <VscSettings size={20} />
                        Settings
                    </Link>
                </nav>
            </div>
        </div>
    );
}