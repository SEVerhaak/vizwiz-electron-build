# VizWiz Electron App

This repository contains an **Electron desktop application** with a **React + Vite renderer** for a visualizer app.

The project uses a nested setup:

- **Root** → Electron main process
- **`renderer/`** → React frontend with Vite

---

## Installation:

Clone the repository:
```bash
git clone https://github.com/SEVerhaak/vizwiz-electron-build.git
cd vizwiz-electron-build
```

Install dependencies for Electron (root):
```bash
npm install
```

Install dependencies for React renderer:
```bash
cd renderer
npm install
```

---

## Running the Application (Development):

You will need 2 terminals:

**Terminal 1 — Start Electron**
```bash
# make sure you are in the root folder!
cd ../
npm start
```

**Terminal 2 — Start the React Vite server**
```bash
cd renderer
npm run dev
```

Electron will open a window and load the React app from the Vite server.

---
## Production Build:

1. **Build the React renderer:**
```bash
cd renderer
npm run build
```

This produces a renderer/dist folder with the built frontend.

2. **Build electron app with electron-packager:**

  - `NOTE: The bash command belows produces a MacOS .app file for Apple Silicon Macs`
```bash
npx electron-packager . VizWiz --platform=darwin --arch=arm64 --out=dist --overwrite
```

**Explanation:**

- `.` → current folder

- `VizWiz` → name of your app

- `--platform=darwin` → macOS
  - Other platform options:
    - darwin (macOS)
    - linux
    - mas (macOS, specifically for submitting to the Mac App Store)
    - win32

- `--arch=arm64` → Apple Silicon Mac (use --arch=x64 for Intel/AMD cpu)
  - Other architecture options:
    - ia32
    - x64
    - armv7l
    - arm64 (Linux: Electron 1.8.0 and above; Windows: 6.0.8 and above; macOS: 11.0.0-beta.1 and above)
    - mips64el (Electron 1.8.2-beta.5 to 1.8.8)

- `--out=dist` → output folder

- `--overwrite` → replace existing builds

After it runs, you’ll see:
`dist/VizWiz-darwin-x64/VizWiz.app`

This is your macOS app that you can run or distribute.

### Optional flags
- `--icon=icon.icns` → set your app icon

- `--app-version=1.0.0` → set version in app bundle

- `--ignore=node_modules|renderer/src` → exclude unnecessary dev files

---
## Notes:

- **Two separate node_modules folders:**

  - Root → Electron dependencies

  - Renderer → React dependencies

- **Development workflow:**

  - Keep two terminals open for React (Vite) and Electron

  - Electron reloads when you restart it; Vite handles hot module replacement for React

- **Future packaging:**

    - You can use electron-builder or electron-packager to create .exe, .dmg, or .AppImage files.

### Recommended Tools

- Node.js >= 18
- NPM >= 9
- Electron >= 41

**Optional:** Wine64 for building Windows on MacOS