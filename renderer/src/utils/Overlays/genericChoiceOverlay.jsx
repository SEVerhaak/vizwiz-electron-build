import {FaCircleInfo} from "react-icons/fa6";
import {IoWarning} from "react-icons/io5";
import {MdOutlineError} from "react-icons/md";

export default function ChoiceOverlay({
                                      message = "",
                                      severity = "info", // "info" | "warning" | "error"
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

    const {color, bg, Icon} = config[severity] || config.info;

    const handleChoice = (accepted) => {
        if (onChoice) {
            onChoice(accepted);
        }
    };

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
                    gap: "16px",
                    alignItems: "center",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
                    <Icon/>
                </div>

                <div style={{color: "white"}}>
                    {message}
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <button
                        onClick={() => handleChoice(false)}
                        style={{
                            padding: "8px 14px",
                            cursor: "pointer",
                            border: "none",
                            background: "#f5f5f5",
                            borderRadius: "8px",
                            color: "black",
                        }}
                    >
                        {rejectText}
                    </button>

                    <button
                        onClick={() => handleChoice(true)}
                        style={{
                            padding: "8px 14px",
                            cursor: "pointer",
                            border: "none",
                            background: color,
                            color: "white",
                            borderRadius: "8px",
                        }}
                    >
                        {acceptText}
                    </button>
                </div>
            </div>
        </div>
    );
}