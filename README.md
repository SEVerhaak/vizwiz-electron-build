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

## Production Build:

1. **Build the React renderer:**
```bash
cd renderer
npm run build
```

This produces a renderer/dist folder with the built frontend.

2. **Update Electron main.js (if not already) to load production:**

replace **`win.loadURL("http://localhost:5173");`** with **`win.loadFile("renderer/dist/index.html");`**

3. **Start Electron (loads the built React app):**
```bash
cd ../
npm start 
```

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