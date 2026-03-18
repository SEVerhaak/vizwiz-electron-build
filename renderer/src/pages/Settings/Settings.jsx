import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PACKS = ["Default", "Extra", "Extra2", "NonMinimal", "MD1"];
const STORAGE_KEY = "vizwiz_packs"; // centralized key

export default function Settings() {
    const [selectedPacks, setSelectedPacks] = useState([]);
    const navigate = useNavigate();

    // Load saved settings once on mount
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            console.log(saved);
            if (Array.isArray(saved) && saved.length > 0) {
                setSelectedPacks(saved);
            } else {
                console.log('fallback!!!!')
                setSelectedPacks(["Default"]); // fallback if nothing saved
            }
        } catch {
            setSelectedPacks(["Default"]); // fallback on parse error
        }
    }, []);

    // Save settings whenever selection changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPacks));
    }, [selectedPacks]);

    const togglePack = (pack) => {
        setSelectedPacks((prev) =>
            prev.includes(pack)
                ? prev.filter((p) => p !== pack)
                : [...prev, pack]
        );
    };

    return (
        <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
            <h1>Settings</h1>

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

            <p style={{ marginTop: "20px" }}>
                <strong>Selected:</strong> {selectedPacks.join(", ")}
            </p>

            <button
                style={{
                    marginTop: "30px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "none"
                }}
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </div>
    );
}