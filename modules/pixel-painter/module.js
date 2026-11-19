        const PALETTE = [
            { name: "Red", hex: "#ff004d" },
            { name: "Orange", hex: "#ffa300" },
            { name: "Yellow", hex: "#ffec27" },
            { name: "Green", hex: "#00e436" },
            { name: "Blue", hex: "#29adff" },
            { name: "Sky", hex: "#8ed8ff" },
            { name: "Mint", hex: "#7de2b1" },
            { name: "Purple", hex: "#7e2553" },
            { name: "Pink", hex: "#ff77a8" },
            { name: "Brown", hex: "#ab5236" },
            { name: "Grey", hex: "#c2c3c7" },
            { name: "Black", hex: "#1d1d21" },
            { name: "Eraser", hex: "#ffffff" }
        ];

        const paletteGrid = document.getElementById("paletteGrid");
        const customColorInput = document.getElementById("customColorInput");
        const pixelBoard = document.getElementById("pixelBoard");
        const previewCanvas = document.getElementById("previewCanvas");
        const previewCtx = previewCanvas.getContext("2d");
        const gridValue = document.getElementById("gridValue");
        const colorValue = document.getElementById("colorValue");
        const filledValue = document.getElementById("filledValue");
        const viewValue = document.getElementById("viewValue");
        const clearButton = document.getElementById("clearButton");
        const exportButton = document.getElementById("exportButton");
        const zoomInButton = document.getElementById("zoomInButton");
        const zoomResetButton = document.getElementById("zoomResetButton");
        const zoomOutButton = document.getElementById("zoomOutButton");
        const newCanvasButton = document.getElementById("newCanvasButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const exportOverlay = document.getElementById("exportOverlay");
        const exportNameInput = document.getElementById("exportNameInput");
        const confirmExportButton = document.getElementById("confirmExportButton");
        const cancelExportButton = document.getElementById("cancelExportButton");

        let gridSize = 12;
        let activeColor = { ...PALETTE[0] };
        let pixels = [];
        let paintingPointer = null;
        let previewZoom = 100;

        function buildPixels(size) {
            pixels = Array.from({ length: size * size }, () => "#ffffff");
        }

        function updateHud() {
            gridValue.textContent = `${gridSize} x ${gridSize}`;
            colorValue.textContent = activeColor.name;
            filledValue.textContent = String(pixels.filter((pixel) => pixel !== "#ffffff").length);
            viewValue.textContent = `${previewZoom}%`;
        }

        function renderPalette() {
            paletteGrid.innerHTML = "";
            PALETTE.forEach((color) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "pixel-color";
                if (activeColor.hex === color.hex && activeColor.name === color.name) button.classList.add("active");
                button.style.background = color.hex === "#ffffff"
                    ? "linear-gradient(180deg, #ffffff 0%, #e6e1d8 100%)"
                    : color.hex;
                button.setAttribute("aria-label", color.name);
                button.title = color.name;
                button.addEventListener("click", () => {
                    activeColor = { ...color };
                    customColorInput.value = color.hex;
                    renderPalette();
                    updateHud();
                });
                paletteGrid.appendChild(button);
            });
        }

        function paintIndex(index) {
            pixels[index] = activeColor.hex;
            const cell = pixelBoard.children[index];
            if (cell) cell.style.background = activeColor.hex;
            drawPreview();
            updateHud();
        }

        function renderBoard() {
            pixelBoard.innerHTML = "";
            pixelBoard.style.setProperty("--pixel-columns", String(gridSize));
            pixels.forEach((color, index) => {
                const cell = document.createElement("button");
                cell.type = "button";
                cell.className = "pixel-cell";
                cell.dataset.index = index;
                cell.tabIndex = index === 0 ? 0 : -1;
                cell.setAttribute("aria-label", `Row ${Math.floor(index / gridSize) + 1}, column ${index % gridSize + 1}`);
                cell.style.background = color;
                cell.addEventListener("pointerdown", (event) => {
                    if (event.button !== 0 || paintingPointer !== null) return;
                    event.preventDefault();
                    paintingPointer = event.pointerId;
                    paintIndex(index);
                });
                cell.addEventListener("click", (event) => {
                    if (event.detail === 0) paintIndex(index);
                });
                pixelBoard.appendChild(cell);
            });
        }

        function drawPreview() {
            previewCanvas.width = gridSize;
            previewCanvas.height = gridSize;
            pixels.forEach((color, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                previewCtx.fillStyle = color;
                previewCtx.fillRect(x, y, 1, 1);
            });
            previewCanvas.style.setProperty("--preview-canvas-size", `${previewZoom}%`);
        }

        function setPreviewZoom(nextZoom) {
            previewZoom = Math.max(50, Math.min(250, nextZoom));
            drawPreview();
            updateHud();
        }

        function sanitizeFileName(value) {
            return value
                .trim()
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
                .replace(/\s+/g, "-");
        }

        function updateExportState() {
            confirmExportButton.disabled = sanitizeFileName(exportNameInput.value).length === 0;
        }

        function exportCanvas() {
            const fileName = sanitizeFileName(exportNameInput.value);
            if (!fileName) return;
            const link = document.createElement("a");
            link.href = previewCanvas.toDataURL("image/png");
            link.download = `${fileName}.png`;
            link.click();
            exportOverlay.hidden = true;
        }

        function resetCanvas(size = gridSize) {
            gridSize = size;
            buildPixels(gridSize);
            renderBoard();
            drawPreview();
            updateHud();
            document.querySelectorAll("[data-size]").forEach((button) => {
                button.classList.toggle("active", Number(button.dataset.size) === gridSize);
                button.classList.toggle("kea-button--secondary", Number(button.dataset.size) !== gridSize);
            });
        }

        document.querySelectorAll("[data-size]").forEach((button) => {
            button.addEventListener("click", () => resetCanvas(Number(button.dataset.size)));
        });

        clearButton.addEventListener("click", () => resetCanvas(gridSize));
        newCanvasButton.addEventListener("click", () => resetCanvas(gridSize));
        zoomInButton.addEventListener("click", () => setPreviewZoom(previewZoom + 25));
        zoomResetButton.addEventListener("click", () => setPreviewZoom(100));
        zoomOutButton.addEventListener("click", () => setPreviewZoom(previewZoom - 25));
        exportButton.addEventListener("click", () => {
            exportNameInput.value = "";
            updateExportState();
            exportOverlay.hidden = false;
        });

        customColorInput.addEventListener("input", () => {
            activeColor = { name: "Custom", hex: customColorInput.value };
            renderPalette();
            updateHud();
        });

        exportNameInput.addEventListener("input", updateExportState);
        confirmExportButton.addEventListener("click", exportCanvas);
        cancelExportButton.addEventListener("click", () => { exportOverlay.hidden = true; });

        pixelBoard.addEventListener("focusin", (event) => {
            if (!event.target.matches(".pixel-cell")) return;
            pixelBoard.querySelector('[tabindex="0"]').tabIndex = -1;
            event.target.tabIndex = 0;
        });
        pixelBoard.addEventListener("keydown", (event) => {
            if (!event.target.matches(".pixel-cell")) return;
            const index = Number(event.target.dataset.index);
            const row = Math.floor(index / gridSize);
            const column = index % gridSize;
            const offsets = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
            const offset = offsets[event.key];
            if (!Array.isArray(offset)) return;
            event.preventDefault();
            const nextRow = Math.max(0, Math.min(gridSize - 1, row + offset[0]));
            const nextColumn = Math.max(0, Math.min(gridSize - 1, column + offset[1]));
            pixelBoard.children[nextRow * gridSize + nextColumn].focus();
        });
        pixelBoard.addEventListener("pointermove", (event) => {
            if (event.pointerId !== paintingPointer) return;
            const cell = document.elementFromPoint(event.clientX, event.clientY);
            if (!cell?.matches(".pixel-cell") || cell.parentElement !== pixelBoard) return;
            const index = Number(cell.dataset.index);
            if (pixels[index] !== activeColor.hex) paintIndex(index);
        });
        function stopPainting(event) {
            if (event.pointerId === paintingPointer) paintingPointer = null;
        }
        window.addEventListener("pointerup", stopPainting);
        window.addEventListener("pointercancel", stopPainting);
        window.addEventListener("blur", () => { paintingPointer = null; });

        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => {
            if (event.target === helpOverlay) helpOverlay.hidden = true;
        });
        exportOverlay.addEventListener("click", (event) => {
            if (event.target === exportOverlay) exportOverlay.hidden = true;
        });

        buildPixels(gridSize);
        customColorInput.value = activeColor.hex;
        renderPalette();
        renderBoard();
        drawPreview();
        updateHud();
