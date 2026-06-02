import { FaCircleInfo } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";

export default function ErrorOverlay({
                                         message = "",
                                         severity = "info",
                                         onClose,
                                     }) {
    const config = {
        info: {
            color: "#ffffff",
            bg: "#3e445e",
            Icon: FaCircleInfo,
        },
        warning: {
            color: "#ffffff",
            bg: "#f59e0b",
            Icon: IoWarning,
        },
        error: {
            color: "#ffffff",
            bg: "rgb(255 0 0 / 0.34)",
            Icon: MdOutlineError,
        },
    };

    const { color, bg, Icon } = config[severity] || config.info;

    return (
        <div style={overlayStyle}>
            <div style={dialogStyle}>
                <div
                    style={{
                        ...iconContainerStyle,
                        background: bg,
                        color,
                    }}
                >
                    <Icon />
                </div>

                <div style={messageStyle}>
                    {message}
                </div>

                <button
                    onClick={onClose}
                    style={buttonStyle}
                >
                    Back
                </button>
            </div>
        </div>
    );
}

/* Styles */

const overlayStyle = {
    position: "fixed",
    inset: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: "rgba(0,0,0,0.5)",

    zIndex: 9999,
    fontWeight: "bold",
};

const dialogStyle = {
    width: "320px",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",

    padding: "24px",

    backgroundColor: "#1a1a1a",

    borderRadius: "10px",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const iconContainerStyle = {
    width: "64px",
    height: "64px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",

    fontSize: "32px",

    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
};

const messageStyle = {
    color: "white",
    textAlign: "center",
    lineHeight: "1.5",
};

const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    marginTop: "8px",
    padding: "12px 20px",

    border: "none",
    borderRadius: "10px",

    backgroundColor: "rgb(255 255 255 / 0.85)",
    color: "#111827",

    fontSize: "16px",
    fontWeight: 600,

    cursor: "pointer",

    transition: "all 0.2s ease",
};