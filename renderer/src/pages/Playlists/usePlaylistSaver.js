import { useNavigate } from "react-router-dom";
import { getPlaylistMode } from "../../utils/playlistModeSwitcher.jsx";
import { removeDraftPlaylist } from "../../utils/removeDraftPlaylist.jsx";

export default function usePlaylistSaver() {
    const navigate = useNavigate();
    const mode = getPlaylistMode();

    const savePlaylist = ({ name, presets, settingsKey }) => {
        const trimmedName = name?.trim();

        if (!trimmedName) {
            console.error("Playlist name is required.");
            return { ok: false, error: "missing_name" };
        }

        if (!presets || presets.length === 0) {
            console.error("Playlist is empty.");
            return { ok: false, error: "empty_playlist" };
        }

        const list =
            JSON.parse(localStorage.getItem("playlist_list")) || [];

        const playlistKey = `playlist_${trimmedName}`;

        const settingsTempKey = "vizwiz_settings_temp";
        const finalSettingsKey = `vizwiz_settings_${trimmedName}`;

        const tempSettings =
            JSON.parse(localStorage.getItem(settingsTempKey)) || {};

        // -------------------------
        // CREATE FLOW
        // -------------------------
        if (mode === "creating") {
            if (list.includes(trimmedName)) {
                console.error("Playlist already exists.");
                return { ok: false, error: "exists" };
            }

            const playlist = {
                name: trimmedName,
                creationTime: new Date().toISOString(),
                presets,
                settings: tempSettings,
            };

            localStorage.setItem(
                playlistKey,
                JSON.stringify(playlist)
            );

            localStorage.setItem(
                finalSettingsKey,
                JSON.stringify(tempSettings)
            );

            localStorage.setItem(
                "playlist_list",
                JSON.stringify([...list, trimmedName])
            );

            localStorage.removeItem(settingsTempKey);

            removeDraftPlaylist();

            navigate("/playlists");

            return { ok: true };
        }

        // -------------------------
        // EDIT FLOW
        // -------------------------
        if (mode === "editing") {
            const draft =
                JSON.parse(localStorage.getItem("playlist_edit") || "{}");

            const originalName = draft.name;

            if (!originalName) {
                console.error("Missing original playlist name.");
                return { ok: false };
            }

            const updatedPlaylist = {
                name: trimmedName,
                creationTime:
                    draft.creationTime || new Date().toISOString(),
                presets,
                settings: tempSettings,
            };

            // if name changed → remove old key
            if (originalName !== trimmedName) {
                localStorage.removeItem(`playlist_${originalName}`);

                const list =
                    JSON.parse(localStorage.getItem("playlist_list")) || [];

                const updatedList = list.map((n) =>
                    n === originalName ? trimmedName : n
                );

                localStorage.setItem(
                    "playlist_list",
                    JSON.stringify(updatedList)
                );
            }

            // Save new version
            localStorage.setItem(
                `playlist_${trimmedName}`,
                JSON.stringify(updatedPlaylist)
            );

            // Keep edit session in sync
            localStorage.setItem(
                "playlist_edit",
                JSON.stringify(updatedPlaylist)
            );

            navigate("/playlists");

            return { ok: true };
        }

        console.error("Invalid mode");
        return { ok: false, error: "invalid_mode" };
    };

    return { savePlaylist, mode };
}