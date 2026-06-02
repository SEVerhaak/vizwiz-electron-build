import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Visualiser from "./pages/Visualiser/Visualiser.jsx";
import Editor from "./pages/Editor/Editor.jsx";
import Overview from "./pages/Overview/Overview.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import PlaylistPage from "./pages/Playlists/Overview.jsx";
import CreatePlaylist from "./pages/Playlists/CreatePlaylist.jsx";
import PlaylistSettingsPage from "./pages/Playlists/PlaylistSettings.jsx";
import EditPlaylist from "./pages/Playlists/EditPlaylist.jsx";
import ButtonShowcase from "./pages/Test-pages/ButtonShowcase.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visualizer/:presetKey?" element={<Visualiser />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/liquidGlass" element={<ButtonShowcase />} />
                <Route path="/playlists" element={<PlaylistPage />} />
                <Route path="/playlists/create" element={<CreatePlaylist />} />
                <Route path="/playlists/edit" element={<EditPlaylist />} />
                <Route path="/playlists/settings" element={<PlaylistSettingsPage />} />
            </Routes>
        </Router>
    );
}