import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MicrophoneSelector from "./MicrophoneSelector"; // 👈 add this
import { Link } from "react-router-dom";

const PACKS = ["Default", "Extra", "Extra2", "NonMinimal", "MD1"];
const PACKS_KEY = "vizwiz_packs";
const VISUALIZER_SETTINGS_KEY = "vizwiz_settings";

export default function Settings() {
    const [selectedPacks, setSelectedPacks] = useState([]);
    const [presetCycle, setPresetCycle] = useState(true);
    const [presetCycleLength, setPresetCycleLength] = useState(15000);

    const navigate = useNavigate();

    // Load packs
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(PACKS_KEY));
        if (Array.isArray(saved) && saved.length > 0) {
            setSelectedPacks(saved);
        } else {
            setSelectedPacks(["Default"]);
        }
    }, []);

    // Save packs
    useEffect(() => {
        localStorage.setItem(PACKS_KEY, JSON.stringify(selectedPacks));
    }, [selectedPacks]);

    // Load visualizer settings
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(VISUALIZER_SETTINGS_KEY));
        if (saved) {
            if (typeof saved.presetCycle === "boolean") setPresetCycle(saved.presetCycle);
            if (typeof saved.presetCycleLength === "number") setPresetCycleLength(saved.presetCycleLength);
        }
    }, []);

    // Save visualizer settings
    useEffect(() => {
        localStorage.setItem(
            VISUALIZER_SETTINGS_KEY,
            JSON.stringify({ presetCycle, presetCycleLength })
        );
    }, [presetCycle, presetCycleLength]);

    const togglePack = (pack) => {
        setSelectedPacks((prev) =>
            prev.includes(pack)
                ? prev.filter((p) => p !== pack)
                : [...prev, pack]
        );
    };

    return (
        <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
            <h1>Settings</h1>

            {/* Preset Packs */}
            <div style={{ marginBottom: "40px" }}>
                <h2>Select Preset Packs</h2>
                {PACKS.map((pack) => (
                    <div key={pack} style={{ margin: "10px 0" }}>
                        <label style={{ cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={selectedPacks.includes(pack)}
                                onChange={() => togglePack(pack)}
                                style={{ marginRight: "8px" }}
                            />
                            {pack}
                        </label>
                    </div>
                ))}
            </div>

            {/* Visualizer Settings */}
            <div style={{
                border: "1px solid #333",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "40px"
            }}>
                <h2>Visualizer Settings</h2>

                <div style={{ margin: "10px 0" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={presetCycle}
                            onChange={() => setPresetCycle(!presetCycle)}
                            style={{ marginRight: "8px" }}
                        />
                        Enable Preset Cycling
                    </label>
                </div>

                <div style={{ margin: "10px 0" }}>
                    <label>
                        Preset Cycle Length (ms):
                        <input
                            type="number"
                            value={presetCycleLength}
                            onChange={(e) => setPresetCycleLength(parseInt(e.target.value, 10) || 0)}
                            style={{ marginLeft: "8px", width: "100px" }}
                        />
                    </label>
                </div>

                {/* 👇 NEW COMPONENT HERE */}
                <MicrophoneSelector />
            </div>

            <Link
                to="/"
                style={{
                    display: "inline-block",
                    marginTop: "10px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    backgroundColor: "#333",
                    color: "white",
                    textDecoration: "none"
                }}
            >
                Back to Home
            </Link>
        </div>
    );
}