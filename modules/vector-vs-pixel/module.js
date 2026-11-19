        const vectorStage = document.getElementById("vectorStage");
        const pixelStage = document.getElementById("pixelStage");
        const pixelCtx = pixelStage.getContext("2d");
        const sampleButtons = document.getElementById("sampleButtons");
        const sampleCycleButton = document.getElementById("sampleCycleButton");
        const zoomSlider = document.getElementById("zoomSlider");
        const gridSlider = document.getElementById("gridSlider");
        const zoomInButton = document.getElementById("zoomInButton");
        const zoomOutButton = document.getElementById("zoomOutButton");
        const zoomResetButton = document.getElementById("zoomResetButton");
        const sampleValue = document.getElementById("sampleValue");
        const zoomValue = document.getElementById("zoomValue");
        const gridValue = document.getElementById("gridValue");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d");
        const samples = {
            rocket: { label: "Rocket", svg: '<rect x="0" y="0" width="100" height="100" rx="18" fill="#17202a"/><g transform="translate(50 50)"><path d="M0 -34 C18 -30 22 -8 14 14 L0 30 L-14 14 C-22 -8 -18 -30 0 -34Z" fill="#ff5959"/><circle cx="0" cy="-5" r="8" fill="#8ed8ff"/><path d="M-14 14 L-28 26 L-18 2 Z" fill="#f6d36c"/><path d="M14 14 L28 26 L18 2 Z" fill="#f6d36c"/><path d="M-6 30 L-14 42 L-4 36 Z" fill="#ffffff"/><path d="M6 30 L14 42 L4 36 Z" fill="#ffffff"/></g>' },
            flower: { label: "Flower", svg: '<rect x="0" y="0" width="100" height="100" rx="18" fill="#16301f"/><rect x="47" y="42" width="6" height="38" rx="3" fill="#4bd66f"/><circle cx="50" cy="36" r="10" fill="#ffd15c"/><circle cx="50" cy="18" r="12" fill="#ff6fae"/><circle cx="67" cy="28" r="12" fill="#ff6fae"/><circle cx="62" cy="48" r="12" fill="#ff6fae"/><circle cx="38" cy="48" r="12" fill="#ff6fae"/><circle cx="33" cy="28" r="12" fill="#ff6fae"/>' },
            face: { label: "Face", svg: '<rect x="0" y="0" width="100" height="100" rx="18" fill="#1e2c4a"/><circle cx="50" cy="50" r="28" fill="#ffd9a3"/><circle cx="39" cy="44" r="4.5" fill="#1c1c1c"/><circle cx="61" cy="44" r="4.5" fill="#1c1c1c"/><path d="M38 61 Q50 71 62 61" stroke="#c75b52" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M42 34 Q50 28 58 34" stroke="#603813" stroke-width="4" fill="none" stroke-linecap="round"/>' }
        };
        const sampleKeys = Object.keys(samples);
        let currentSampleIndex = 0;
        let zoomPercent = 400;
        let gridSize = 24;
        function currentSample() { return samples[sampleKeys[currentSampleIndex]]; }
        function buildSVGMarkup() {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${currentSample().svg}</svg>`;
        }
        function updateButtons() {
            sampleButtons.innerHTML = "";
            sampleKeys.forEach((key, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "kea-button kea-button--secondary";
                button.textContent = samples[key].label;
                button.setAttribute("aria-pressed", String(index === currentSampleIndex));
                if (index === currentSampleIndex) button.classList.add("is-active");
                button.addEventListener("click", () => { currentSampleIndex = index; updateButtons(); render(); });
                sampleButtons.appendChild(button);
            });
        }
        function renderVector() {
            vectorStage.innerHTML = currentSample().svg;
            vectorStage.style.transform = `scale(${zoomPercent / 400})`;
            vectorStage.style.transformOrigin = "center";
        }
        function renderPixel() {
            const size = gridSize;
            offscreen.width = size;
            offscreen.height = size;
            const image = new Image();
            image.onload = () => {
                offCtx.clearRect(0, 0, size, size);
                offCtx.drawImage(image, 0, 0, size, size);
                pixelCtx.clearRect(0, 0, pixelStage.width, pixelStage.height);
                pixelCtx.fillStyle = "#101319";
                pixelCtx.fillRect(0, 0, pixelStage.width, pixelStage.height);
                pixelCtx.imageSmoothingEnabled = false;
                const drawSize = pixelStage.width * (zoomPercent / 400);
                const drawX = (pixelStage.width - drawSize) / 2;
                const drawY = (pixelStage.height - drawSize) / 2;
                pixelCtx.drawImage(offscreen, drawX, drawY, drawSize, drawSize);
            };
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildSVGMarkup())}`;
        }
        function render() {
            sampleValue.textContent = currentSample().label;
            zoomValue.textContent = `${zoomPercent}%`;
            gridValue.textContent = `${gridSize} px`;
            renderVector();
            renderPixel();
        }
        zoomSlider.addEventListener("input", () => { zoomPercent = Number(zoomSlider.value); render(); });
        gridSlider.addEventListener("input", () => { gridSize = Number(gridSlider.value); render(); });
        zoomInButton.addEventListener("click", () => { zoomPercent = Math.min(800, zoomPercent + 100); zoomSlider.value = String(zoomPercent); render(); });
        zoomOutButton.addEventListener("click", () => { zoomPercent = Math.max(100, zoomPercent - 100); zoomSlider.value = String(zoomPercent); render(); });
        zoomResetButton.addEventListener("click", () => { zoomPercent = 400; zoomSlider.value = "400"; render(); });
        sampleCycleButton.addEventListener("click", () => { currentSampleIndex = (currentSampleIndex + 1) % sampleKeys.length; updateButtons(); render(); });
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        updateButtons();
        render();
