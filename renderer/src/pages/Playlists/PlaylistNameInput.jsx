export default function PlaylistNameInput({ value, onChange }) {
    return (
        <div className="settings-row">
            <label>
                Playlist name:
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter playlist name..."
                />
            </label>
        </div>
    );
}