import { FaCircleInfo } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";

export default function ErrorOverlay({
         message = "",
         severity = "info", // "info" | "warning" | "error"
         onClose,
     }) {
    const config = {
        info: {
            color: "#1976d2",
            bg: "#e3f2fd",
            Icon: FaCircleInfo,
        },
        warning: {
            color: "#ed6c02",
            bg: "#fff4e5",
            Icon: IoWarning,
        },
        error: {
            color: "#d32f2f",
            bg: "#fdecea",
            Icon: MdOutlineError,
        },
    };

    const { color, bg, Icon } = config[severity] || config.info;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                fontWeight: "bold",
            }}
        >
            <div
                style={{
                    background: "#192126",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "320px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        background: bg,
                        color: color,
                        padding: "12px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                    }}
                >
                    <Icon />
                </div>

                <div style={{ color: "white" }}>
                    {message}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        color: "#192126",
                    }}
                >
                    Back
                </button>
            </div>
        </div>
    );
}