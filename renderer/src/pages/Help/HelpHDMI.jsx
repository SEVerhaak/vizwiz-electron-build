import { useState } from "react";
import "./style/helphdmi.css";
import "../../App.css"
import {Link} from "react-router-dom";

export default function HDMIHelp() {
    const [activeTab, setActiveTab] = useState("windows");

    const helpContent = {
        windows: {
            title: "Connect HDMI on Windows",
            image: "/images/windows-hdmi-placeholder.png",
            text: `
1. Connect the HDMI cable to your computer and display.
2. Turn on the monitor or TV.
3. Press Windows + P.
4. Choose Duplicate, Extend, or Second Screen Only.
5. Adjust display settings if needed.
            `,
        },
        macos: {
            title: "Connect HDMI on macOS",
            image: "/images/macos-hdmi-placeholder.png",
            text: `
1. Connect the HDMI cable or adapter to your Mac.
2. Connect the other end to your monitor or TV.
3. Open System Settings > Displays.
4. Configure your display arrangement.
5. Select the desired resolution and refresh rate.
            `,
        },
        linux: {
            title: "Connect HDMI on Linux",
            image: "/images/linux-hdmi-placeholder.png",
            text: `
1. Connect the HDMI cable to your computer and display.
2. Open your system's display settings.
3. Detect displays if necessary.
4. Configure screen layout and resolution.
5. Apply the changes.
            `,
        },
    };

    const current = helpContent[activeTab];

    return (
        <div className="hdmi-help">
            <h1 className="hdmi-help__heading">
                HDMI Connection Guide
            </h1>

            <div className="hdmi-help__tabs">
                <button
                    className={activeTab === "windows" ? "active btn btn-secondary" : "btn btn-primary"}
                    onClick={() => setActiveTab("windows")}
                >
                    Windows
                </button>

                <button
                    className={activeTab === "macos" ? "active btn btn-secondary" : "btn btn-primary"}
                    onClick={() => setActiveTab("macos")}
                >
                    macOS
                </button>

                <button
                    className={activeTab === "linux" ? "active btn btn-secondary" : "btn btn-primary"}
                    onClick={() => setActiveTab("linux")}
                >
                    Linux
                </button>
            </div>

            <div className="hdmi-help__content">
                <div className="hdmi-help__details">
                    <h2>{current.title}</h2>
                    <p>{current.text}</p>
                </div>
            </div>
            <Link className={"btn btn-primary mt"} to="/">Back to home</Link>
        </div>
    );
}