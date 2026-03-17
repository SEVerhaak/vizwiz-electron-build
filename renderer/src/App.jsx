import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Visualiser from "./pages/Visualiser/Visualiser.jsx";
import Editor from "./pages/Editor/Editor.jsx";
import Overview from "./pages/Overview/Overview.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visualiser" element={<Visualiser />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/overview" element={<Overview />} />
            </Routes>
        </Router>
    );
}