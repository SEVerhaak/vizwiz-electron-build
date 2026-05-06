export const setPlaylistMode = (mode) => {
    if (mode !== "editing" && mode !== "creating") {
        console.error("Invalid mode:", mode);
        return;
    }

    localStorage.setItem("playlist_mode", mode);
};

export const getPlaylistMode = () => {
    return localStorage.getItem("playlist_mode");
};