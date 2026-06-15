const { app, BrowserWindow } = require("electron");
const path = require("path");

app.commandLine.appendSwitch(
    'disable-features',
    'WebRtcAllowInputVolumeAdjustment'
);
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.maximize();

    if (app.isPackaged) {
        // Production: load built React files
        win.loadFile(path.join(__dirname, "renderer/dist/index.html"));
    } else {
        // Development: load Vite dev server
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);