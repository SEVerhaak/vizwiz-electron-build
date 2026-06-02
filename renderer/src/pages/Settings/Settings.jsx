import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MicrophoneSelector from "./MicrophoneSelector";
import { resetAll, resetToDefaultSettings } from "../../utils/initDefaultSettings.jsx";

import "./style/settings.css";
import "../../App.css"

const PACKS = ["Default", "Extra", "Extra2", "NonMinimal", "MD1"];
const PACKS_KEY = "vizwiz_packs";
const VISUALIZER_SETTINGS_KEY = "vizwiz_settings";

export default function Settings() {
    const [selectedPacks, setSelectedPacks] = useState([]);
    const [presetCycle, setPresetCycle] = useState(true);
    const [presetCycleLength, setPresetCycleLength] = useState(15000);

    // Load packs
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(PACKS_KEY));
        if (Array.isArray(saved) && saved.length > 0) {
            setSelectedPacks(saved);
        } else {
            setSelectedPacks(["Default"]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(PACKS_KEY, JSON.stringify(selectedPacks));
    }, [selectedPacks]);

    // Load settings
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(VISUALIZER_SETTINGS_KEY));
        if (saved) {
            if (typeof saved.presetCycle === "boolean") setPresetCycle(saved.presetCycle);
            if (typeof saved.presetCycleLength === "number") setPresetCycleLength(saved.presetCycleLength);
        }
    }, []);

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
        <div className="settings-page">
            <h1>Global Visualizer Settings</h1>

            {/* Preset Packs */}
            <div className="settings-section">
                <h2>Select Preset Packs</h2>

                {PACKS.map((pack) => (
                    <div key={pack} className="settings-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedPacks.includes(pack)}
                                onChange={() => togglePack(pack)}
                            />
                            {pack}
                        </label>
                    </div>
                ))}
            </div>

            {/* Visualizer Settings */}
            <div className="settings-box">
                <h2 className={"vis-settings-title"}>Visualizer Settings</h2>

                <div className="settings-row">
                    <label>
                        <input
                            type="checkbox"
                            checked={presetCycle}
                            onChange={() => setPresetCycle(!presetCycle)}
                        />
                        Enable Preset Cycling
                    </label>
                </div>

                <div className="settings-row">
                    <label>
                        Preset Cycle Length (ms):
                        <input
                            type="number"
                            value={presetCycleLength}
                            onChange={(e) =>
                                setPresetCycleLength(parseInt(e.target.value, 10) || 0)
                            }
                        />
                    </label>
                </div>

                <MicrophoneSelector />
            </div>

            {/* Buttons */}
            <h3 className={"vis-settings-title"}>Having trouble with the visualizer? Try a reset!</h3>
            <div className="settings-buttons">
                <button className={"btn-small btn-warning"} onClick={resetToDefaultSettings}>
                    Reset Defaults (Restores default settings)
                </button>

                <button className={"btn-small btn-danger"} onClick={resetAll}>
                    Factory Reset (removes all playlists & restores settings)
                </button>

                {/*<Link className={"btn btn-secondary"} to="/liquidGlass">Button test</Link>*/}

            </div>

            <div className="settings-navigation-row">
                <Link className={"btn btn-success"} to="/">Save Settings & Go Back</Link>
            </div>
        </div>
    );
}