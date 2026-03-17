// renderer.js

// Wait for the DOM to be ready
window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");

    // Initialize Butterchurn visualizer
    const visualizer = butterchurn.default.createVisualizer(null, canvas, {
        width: 800,
        height: 600,
        mesh_width: 64,
        mesh_height: 48,
        pixelRatio: window.devicePixelRatio || 1,
        textureRatio: 1
    });

    // Load presets and extra images
    visualizer.loadExtraImages(imageDataButterchurnPresets.default);
    const presets = { ...allButterchurnPresets.default };
    const presetKeys = Object.keys(presets);
    let presetIndex = Math.floor(Math.random() * presetKeys.length);
    let presetIndexHist = [];
    let presetCycle = true;
    let cycleInterval = null;
    let dropdownVisible = false;
    const presetCycleLength = 15000; // 15s default

    // Populate dropdown
    presetKeys.forEach((key, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = key;
        presetSelect.appendChild(option);
    });

    // Change preset when dropdown changes
    presetSelect.addEventListener("change", (e) => {
        const index = parseInt(e.target.value, 10);
        presetIndex = index;

        visualizer.loadPreset(
            presets[presetKeys[presetIndex]],
            5.7 // blend time
        );

        restartCycleInterval();
    });

    // Resize canvas to window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        visualizer.setRendererSize(canvas.width, canvas.height);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Function to load next preset
    function nextPreset(blendTime = 5.7) {
        presetIndexHist.push(presetIndex);
        presetIndex = Math.floor(Math.random() * presetKeys.length);

        visualizer.loadPreset(presets[presetKeys[presetIndex]], blendTime);

        presetSelect.value = presetIndex;

        restartCycleInterval();
    }

    // Function to load previous preset
    function prevPreset(blendTime = 5.7) {
        if (presetIndexHist.length > 0) {
            presetIndex = presetIndexHist.pop();
        } else {
            presetIndex = (presetIndex - 1 + presetKeys.length) % presetKeys.length;
        }
        visualizer.loadPreset(presets[presetKeys[presetIndex]], blendTime);
        presetSelect.value = presetIndex;
        restartCycleInterval();
    }

    // Restart cycling interval
    function restartCycleInterval() {
        if (cycleInterval) clearInterval(cycleInterval);
        if (presetCycle) {
            cycleInterval = setInterval(() => nextPreset(2.7), presetCycleLength);
        }
    }

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case " ":
            case "ArrowRight":
                nextPreset();
                break;

            case "Backspace":
            case "ArrowLeft":
                prevPreset();
                break;

            case "H":
            case "h":
                nextPreset(0);
                break;

            case "b":
            case "B":
                dropdownVisible = !dropdownVisible;
                presetSelect.style.display = dropdownVisible ? "block" : "none";
                break;
        }
    });

    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            source.connect(analyser);

            // Render loop
            function render() {
                const dataArray = new Uint8Array(analyser.fftSize);
                analyser.getByteTimeDomainData(dataArray);

                // Duplicate mono input for L/R channels
                try {
                    visualizer.render({
                        elapsedTime: 1 / 60,
                        audioLevels: {
                            timeByteArray: Array.from(dataArray),
                            timeByteArrayL: Array.from(dataArray),
                            timeByteArrayR: Array.from(dataArray)
                        }
                    });
                } catch (err) {
                    console.warn("Butterchurn render error (skipping frame):", err);
                }

                requestAnimationFrame(render);
            }

            render();
        })
        .catch(err => {
            console.error("Microphone capture failed:", err);
            // Optionally show a message overlay here
        });

    // Start initial preset cycle
    nextPreset(0);
    restartCycleInterval();
});