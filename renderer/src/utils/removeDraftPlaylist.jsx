export const removeDraftPlaylist = () => {
    localStorage.removeItem("playlist_draft");
};

export const removeEditPlaylist = () => {
  localStorage.removeItem("playlist_edit")
};