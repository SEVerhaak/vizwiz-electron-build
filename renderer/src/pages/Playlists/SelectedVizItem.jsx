import "../../App.css"

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
        justifyContent: "space-between",
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>🎵 {name}</div>

            <div style={buttonRowStyle}>
                <button disabled className={"btn-small btn-disabled"}>Preview</button>
                <button className={"btn-small btn-danger"} onClick={() => onRemove(name)}>
                    Remove
                </button>
            </div>
        </div>
    );
}