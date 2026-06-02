import "./ButtonShowcase.css";
import "../../App.css"
export default function ButtonShowcase() {
    return (
        <div className="page">
            <div className="container">
                <h1>Button Variants Demo</h1>
                <p>Simple rounded buttons for different action types.</p>

                <div className="button-grid">
                    <button className="btn btn-primary">Primary</button>
                    <button className="btn btn-secondary">Secondary</button>
                    <button className="btn btn-success">Success</button>
                    <button className="btn btn-warning">Warning</button>
                    <button className="btn btn-danger">Danger</button>
                    <button className="btn btn-info">Info</button>
                    <button className="btn btn-outline">Outline</button>
                    <button className="btn btn-ghost">Ghost</button>
                    <button className="btn btn-disabled" disabled>
                        Disabled
                    </button>
                </div>

                <div className="section">
                    <h2>Example Actions</h2>

                    <div className="action-buttons">
                        <button className="btn btn-primary">Save</button>
                        <button className="btn btn-success">Publish</button>
                        <button className="btn btn-warning">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                        <button className="btn btn-outline">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}