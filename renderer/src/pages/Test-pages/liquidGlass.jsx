// File: LiquidGlassGradientBoxes.jsx
import React, { useRef } from "react";
import LiquidGlass from "liquid-glass-react";

export default function LiquidGlassGradientBoxes() {
    const containerRef = useRef(null);

    // Generate an array of random gradients
    const boxes = Array.from({ length: 10 }).map(() => {
        const angle = Math.floor(Math.random() * 360);
        const color1 = `hsl(${Math.random() * 360}, 70%, 50%)`;
        const color2 = `hsl(${Math.random() * 360}, 70%, 50%)`;
        return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    });

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                overflowY: "scroll",
                background: "#111",
                paddingTop: "50px",
                paddingBottom: "50px",
            }}
        >
            {/* Fixed center button */}
            <LiquidGlass
                mouseContainer={containerRef}
                displacementScale={64}
                blurAmount={0.1}
                saturation={130}
                aberrationIntensity={2}
                elasticity={0.35}
                cornerRadius={100}
                padding="20px 40px"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={() => alert("Button clicked!")}
            >
        <span
            style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                pointerEvents: "none",
            }}
        >
          Click Me
        </span>
            </LiquidGlass>

            {/* Scrollable gradient boxes */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    alignItems: "center",
                }}
            >
                {boxes.map((bg, index) => (
                    <div
                        key={index}
                        style={{
                            width: "400px",
                            height: "400px",
                            borderRadius: "16px",
                            background: bg,
                            border: "4px solid #333",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}