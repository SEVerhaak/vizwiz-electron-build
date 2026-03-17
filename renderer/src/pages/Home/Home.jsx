import { Link } from "react-router-dom";
// import "./Home.css"; // optional for styling

export default function Home() {
    return (
        <div className="home-container" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#1a1a1a",
            color: "white",
            fontFamily: "sans-serif"
        }}>
            <h1>My Visualizer App</h1>
            <nav style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "40px" }}>
                <Link to="/visualizer" style={linkStyle}>Visualizer</Link>
                <Link to="/editor" style={linkStyle}>Editor (coming soon)</Link>
                <Link to="/overview" style={linkStyle}>Overview</Link>
            </nav>
        </div>
    );
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "10px 20px",
    backgroundColor: "#333",
    borderRadius: "5px",
    textAlign: "center",
    minWidth: "150px"
};