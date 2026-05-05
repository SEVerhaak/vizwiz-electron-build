const PACKS = ["Default", "Extra", "Extra2", "NonMinimal", "MD1"];

const PACKS_KEY = "vizwiz_packs";
const VISUALIZER_SETTINGS_KEY = "vizwiz_settings";

export const initDefaultSettings = () => {
    const packs = localStorage.getItem(PACKS_KEY);
    const settings = localStorage.getItem(VISUALIZER_SETTINGS_KEY);

    if (!packs) {
        localStorage.setItem(PACKS_KEY, JSON.stringify(PACKS));
    }

    if (!settings) {
        localStorage.setItem(
            VISUALIZER_SETTINGS_KEY,
            JSON.stringify({
                presetCycle: true,
                presetCycleLength: 15000
            })
        );
    }
};

export const resetToDefaultSettings = () => {
    localStorage.setItem("vizwiz_packs", JSON.stringify(PACKS));

    localStorage.setItem(
        "vizwiz_settings",
        JSON.stringify({
            presetCycle: true,
            presetCycleLength: 15000
        })
    );

    window.location.reload();

};

export const resetAll = () => {
    localStorage.clear();
    resetToDefaultSettings();
}