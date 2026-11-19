        const mainPreview = document.getElementById("rgbMainPreview");
        const pixelCanvas = document.getElementById("rgbPixelCanvas");
        const pixelCtx = pixelCanvas.getContext("2d");
        const redSlider = document.getElementById("redSlider");
        const greenSlider = document.getElementById("greenSlider");
        const blueSlider = document.getElementById("blueSlider");
        const redValue = document.getElementById("redValue");
        const greenValue = document.getElementById("greenValue");
        const blueValue = document.getElementById("blueValue");
        const redHud = document.getElementById("redHud");
        const greenHud = document.getElementById("greenHud");
        const blueHud = document.getElementById("blueHud");
        const hexHud = document.getElementById("hexHud");
        const blendHud = document.getElementById("blendHud");
        const presetButtons = document.getElementById("presetButtons");
        const resetButton = document.getElementById("resetButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const presets = [
            { label: "White", r:255, g:255, b:255 },
            { label: "Amber", r:255, g:180, b:72 },
            { label: "Magenta", r:255, g:64, b:200 },
            { label: "Cyan", r:60, g:230, b:255 }
        ];
        function describeBlend(r, g, b) {
            if (r > 220 && g > 220 && b > 220) return "Bright white";
            if (r > 220 && g > 150 && b < 120) return "Warm amber";
            if (r > 200 && b > 180 && g < 130) return "Magenta glow";
            if (g > 180 && b > 180 && r < 130) return "Cyan glow";
            if (r > 180 && g > 180 && b < 90) return "Yellow light";
            return "Mixed light";
        }
        function toHex(r, g, b) { return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`; }
        function drawSubpixels(r, g, b) {
            pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
            pixelCtx.fillStyle = "#060606";
            pixelCtx.fillRect(0, 0, pixelCanvas.width, pixelCanvas.height);
            const colors = [`rgb(${r},0,0)`, `rgb(0,${g},0)`, `rgb(0,0,${b})`];
            const pitch = Math.floor(Math.min(pixelCanvas.width, pixelCanvas.height) / 6);
            const stripe = Math.floor((pitch - 8) / 3);
            const marginX = Math.floor((pixelCanvas.width - pitch * 6) / 2);
            const marginY = Math.floor((pixelCanvas.height - pitch * 6) / 2);
            for (let row = 0; row < 6; row += 1) {
                for (let col = 0; col < 6; col += 1) {
                    colors.forEach((color, channel) => {
                        pixelCtx.fillStyle = color;
                        pixelCtx.fillRect(marginX + col * pitch + channel * (stripe + 2), marginY + row * pitch, stripe, pitch - 4);
                    });
                }
            }
        }
        function render() {
            const r = Number(redSlider.value);
            const g = Number(greenSlider.value);
            const b = Number(blueSlider.value);
            redValue.textContent = String(r);
            greenValue.textContent = String(g);
            blueValue.textContent = String(b);
            redHud.textContent = String(r);
            greenHud.textContent = String(g);
            blueHud.textContent = String(b);
            hexHud.textContent = toHex(r, g, b);
            blendHud.textContent = describeBlend(r, g, b);
            mainPreview.style.background = `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28), transparent 30%), rgb(${r}, ${g}, ${b})`;
            drawSubpixels(r, g, b);
        }
        function setPreset(preset) {
            redSlider.value = String(preset.r);
            greenSlider.value = String(preset.g);
            blueSlider.value = String(preset.b);
            render();
        }
        presets.forEach((preset) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "kea-button kea-button--secondary";
            button.textContent = preset.label;
            button.addEventListener("click", () => setPreset(preset));
            presetButtons.appendChild(button);
        });
        [redSlider, greenSlider, blueSlider].forEach((slider) => slider.addEventListener("input", render));
        resetButton.addEventListener("click", () => setPreset(presets[1]));
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        setPreset(presets[1]);
