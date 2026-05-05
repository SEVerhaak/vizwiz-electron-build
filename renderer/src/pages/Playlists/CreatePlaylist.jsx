import Overview from "../Overview/Overview.jsx";

export default function CreatePlaylist() {
    // Layout
    const pageStyle = {
        padding: "20px",
    };

    const columnsWrapperStyle = {
        display: "flex",
        justifyContent: "space-between",
        gap: "10%",
        width: "100%",
        marginTop: "20px",
    };

    // LEFT COLUMN
    const leftColumnStyle = {
        width: "60%",
    };

    const leftHeaderStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    };

    const overviewContainerStyle = {
        height: "600px",
    };

    const filterButtonStyle = {
        padding: "6px 12px",
        cursor: "pointer",
    };

    // RIGHT COLUMN
    const rightColumnStyle = {
        width: "30%",
    };

    const rightBoxStyle = {
        border: "1px solid #ccc",
        height: "600px",
        padding: "10px",
    };

    const nextButtonStyle = {
        marginTop: "10px",
        width: "100%",
        padding: "10px",
        cursor: "pointer",
    };

    return (
        <div style={pageStyle}>
            <h1>CREATE NEW PLAYLIST</h1>

            <div style={columnsWrapperStyle}>
                {/* LEFT COLUMN */}
                <div style={leftColumnStyle}>
                    <div style={leftHeaderStyle}>
                        <h2 style={{ margin: 0 }}>Overview</h2>

                        <button style={filterButtonStyle}>
                            Filter
                        </button>
                    </div>

                    <div style={overviewContainerStyle}>
                        <Overview />
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={rightColumnStyle}>
                    <h2>Details</h2>

                    <div style={rightBoxStyle}>
                        Right column content goes here
                    </div>

                    <button style={nextButtonStyle}>
                        Next step
                    </button>
                </div>
            </div>
        </div>
    );
}