import { FaCircleInfo } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";

export default function ChoiceOverlay({
                                          message = "",
                                          severity = "info",
                                          acceptText = "Accept",
                                          rejectText = "Cancel",
                                          onChoice,
                                      }) {
    const config = {
        info: {
            color: "#1976d2",
            bg: "#ffffff",
            Icon: FaCircleInfo,
        },
        warning: {
            color: "#ed6c02",
            bg: "#ffffff",
            Icon: IoWarning,
        },
        error: {
            color: "#d32f2f",
            bg: "#ffffff",
            Icon: MdOutlineError,
        },
    };

    const { color, bg, Icon } = config[severity] || config.info;

    const handleChoice = (accepted) => {
        onChoice?.(accepted);
    };

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

                <div style={buttonContainerStyle}>
                    <button
                        onClick={() => handleChoice(false)}
                        style={cancelButtonStyle}
                    >
                        {rejectText}
                    </button>

                    <button
                        onClick={() => handleChoice(true)}
                        style={{
                            ...acceptButtonStyle,
                            background: color,
                        }}
                    >
                        {acceptText}
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
};

const dialogStyle = {
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    padding: "24px",
    width: "340px",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",

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
    fontSize: "16px",
};

const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    width: "100%",
    justifyContent: "center",
};

const cancelButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",

    backgroundColor: "rgb(255 255 255 / 0.73)",
    color: "#111827",

    fontSize: "16px",
    fontWeight: 600,

    cursor: "pointer",
    transition: "all 0.2s ease",
};

const acceptButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",

    color: "white",

    fontSize: "16px",
    fontWeight: 600,

    cursor: "pointer",
    transition: "all 0.2s ease",
};