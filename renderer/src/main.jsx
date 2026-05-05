import './index.css'

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initDefaultSettings } from "./utils/initDefaultSettings"; // 👈 add this

// 👇 run once before React starts
initDefaultSettings();

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);