export default function SelectedVizItem({ name, onRemove }) {
    const containerStyle = {
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    };

    const titleStyle = {
        fontWeight: "bold",
    };

    const buttonRowStyle = {
        display: "flex",
        gap: "8px",
    };

    const buttonStyle = {
        padding: "6px 10px",
        cursor: "pointer",
        flex: 1,
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🎵 {name}</div>

            <div style={buttonRowStyle}>
                <button style={buttonStyle}>Preview</button>
                <button style={buttonStyle} onClick={() => onRemove(name)}>
                    Remove
                </button>
            </div>
        </div>
    );
}