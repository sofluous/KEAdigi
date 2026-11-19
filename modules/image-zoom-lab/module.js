        const zoomCanvas = document.getElementById("zoomCanvas"), zoomCtx = zoomCanvas.getContext("2d");
        const inspectCanvas = document.getElementById("inspectCanvas"), inspectCtx = inspectCanvas.getContext("2d");
        const zoomViewport = document.getElementById("zoomViewport"), inspectZoomSlider = document.getElementById("inspectZoomSlider");
        const zoomValue = document.getElementById("zoomValue"), sampleValue = document.getElementById("sampleValue");
        const pixelValue = document.getElementById("pixelValue"), blendValue = document.getElementById("blendValue");
        const inspectSwatch = document.getElementById("inspectSwatch");
        const zoomInButton = document.getElementById("zoomInButton"), zoomOutButton = document.getElementById("zoomOutButton"), zoomResetButton = document.getElementById("zoomResetButton");
        const sampleButton = document.getElementById("sampleButton"), imageUploadInput = document.getElementById("imageUploadInput");
        const helpButton = document.getElementById("helpButton"), closeHelpButton = document.getElementById("closeHelpButton"), helpOverlay = document.getElementById("helpOverlay");
        const sourceCanvas = document.createElement("canvas"), sourceCtx = sourceCanvas.getContext("2d");
        let zoomPercent = 400, offsetX = 0, offsetY = 0;
        let panStart = null;
        let dragging = false;
        let inspectSpan = 9;
        let samplePoint = { x: 0, y: 0 };
        function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
        function describeBlend(r, g, b) { if (r > 210 && g > 190 && b < 130) return "Warm gold"; if (r > 190 && g < 110 && b < 110) return "Strong red"; if (b > 180 && g > 160) return "Cool blue"; if (g > 170 && r < 170) return "Leafy green"; if (r > 180 && b > 170) return "Soft pink"; if (r > 200 && g > 200 && b > 200) return "Bright light"; return "Mixed color"; }
        function buildSampleImage() {
            sourceCanvas.width = 320; sourceCanvas.height = 200;
            const gradient = sourceCtx.createLinearGradient(0, 0, 320, 200);
            gradient.addColorStop(0, "#f9d85b"); gradient.addColorStop(0.55, "#ff7b59"); gradient.addColorStop(1, "#3266d6");
            sourceCtx.fillStyle = gradient; sourceCtx.fillRect(0, 0, 320, 200);
            sourceCtx.fillStyle = "rgba(255,255,255,0.65)"; sourceCtx.beginPath(); sourceCtx.arc(74, 64, 32, 0, Math.PI * 2); sourceCtx.fill();
            sourceCtx.fillStyle = "rgba(30,24,45,0.45)"; sourceCtx.beginPath(); sourceCtx.moveTo(0,170); sourceCtx.lineTo(90,98); sourceCtx.lineTo(170,170); sourceCtx.closePath(); sourceCtx.fill();
            sourceCtx.fillStyle = "rgba(16,18,29,0.55)"; sourceCtx.beginPath(); sourceCtx.moveTo(120,170); sourceCtx.lineTo(220,84); sourceCtx.lineTo(320,170); sourceCtx.closePath(); sourceCtx.fill();
            sourceCtx.fillStyle = "rgba(18,74,46,0.9)";
            for (let i = 0; i < 10; i += 1) { const x = 26 + (i * 28); sourceCtx.beginPath(); sourceCtx.moveTo(x,174); sourceCtx.lineTo(x + 10,132); sourceCtx.lineTo(x + 20,174); sourceCtx.closePath(); sourceCtx.fill(); }
            sampleValue.textContent = "Sample"; resetView();
        }
        function loadImageFromFile(file) {
            const reader = new FileReader();
            reader.onload = () => { const img = new Image(); img.onload = () => { sourceCanvas.width = img.width; sourceCanvas.height = img.height; sourceCtx.clearRect(0,0,img.width,img.height); sourceCtx.drawImage(img,0,0); sampleValue.textContent = file.name; resetView(); }; img.src = reader.result; };
            reader.readAsDataURL(file);
        }
        function zoomScale() { return zoomPercent / 100; }
        function resetView() { zoomPercent = 400; offsetX = 0; offsetY = 0; samplePoint = { x: Math.floor(sourceCanvas.width / 2), y: Math.floor(sourceCanvas.height / 2) }; render(); }
        function viewportMetrics() { return { width: zoomCanvas.width, height: zoomCanvas.height, scaledWidth: sourceCanvas.width * zoomScale(), scaledHeight: sourceCanvas.height * zoomScale() }; }
        function clampOffsets() { const { width, height, scaledWidth, scaledHeight } = viewportMetrics(); const maxX = Math.max(0, (scaledWidth - width) / 2); const maxY = Math.max(0, (scaledHeight - height) / 2); offsetX = clamp(offsetX, -maxX, maxX); offsetY = clamp(offsetY, -maxY, maxY); }
        function sourcePointFromClient(clientX, clientY) {
            const rect = zoomCanvas.getBoundingClientRect(), localX = ((clientX - rect.left) / rect.width) * zoomCanvas.width, localY = ((clientY - rect.top) / rect.height) * zoomCanvas.height;
            const { width, height, scaledWidth, scaledHeight } = viewportMetrics();
            const drawX = (width - scaledWidth) / 2 - offsetX, drawY = (height - scaledHeight) / 2 - offsetY;
            return { x: clamp(Math.floor((localX - drawX) / zoomScale()), 0, sourceCanvas.width - 1), y: clamp(Math.floor((localY - drawY) / zoomScale()), 0, sourceCanvas.height - 1) };
        }
        function updateInspection() {
            const halfSpan = Math.floor(inspectSpan / 2);
            const startX = clamp(samplePoint.x - halfSpan, 0, Math.max(0, sourceCanvas.width - inspectSpan));
            const startY = clamp(samplePoint.y - halfSpan, 0, Math.max(0, sourceCanvas.height - inspectSpan));
            inspectCtx.clearRect(0, 0, inspectCanvas.width, inspectCanvas.height);
            inspectCtx.imageSmoothingEnabled = false;
            inspectCtx.drawImage(sourceCanvas, startX, startY, inspectSpan, inspectSpan, 0, 0, inspectCanvas.width, inspectCanvas.height);
            const sample = sourceCtx.getImageData(samplePoint.x, samplePoint.y, 1, 1);
            const data = sample.data;
            const r = data[0], g = data[1], b = data[2];
            pixelValue.textContent = `${r}, ${g}, ${b}`; blendValue.textContent = describeBlend(r, g, b); inspectSwatch.style.background = `rgb(${r}, ${g}, ${b})`;
        }
        function render() {
            clampOffsets();
            const scale = zoomScale(), { width, height, scaledWidth, scaledHeight } = viewportMetrics();
            zoomCtx.clearRect(0, 0, width, height); zoomCtx.fillStyle = "#0f1116"; zoomCtx.fillRect(0, 0, width, height); zoomCtx.imageSmoothingEnabled = false;
            const drawX = (width - scaledWidth) / 2 - offsetX, drawY = (height - scaledHeight) / 2 - offsetY;
            zoomCtx.drawImage(sourceCanvas, drawX, drawY, scaledWidth, scaledHeight);
            const markerX = drawX + (samplePoint.x * scale), markerY = drawY + (samplePoint.y * scale);
            zoomCtx.strokeStyle = "rgba(255,255,255,0.88)"; zoomCtx.lineWidth = 2; zoomCtx.strokeRect(markerX - 2, markerY - 2, scale + 4, scale + 4);
            zoomValue.textContent = `${zoomPercent}%`; updateInspection();
        }
        function resizeCanvas() { const rect = zoomViewport.getBoundingClientRect(); zoomCanvas.width = Math.max(320, Math.floor(rect.width)); zoomCanvas.height = Math.max(220, Math.floor(rect.height)); render(); }
        inspectZoomSlider.addEventListener("input", () => { inspectSpan = Number(inspectZoomSlider.value); render(); });
        zoomInButton.addEventListener("click", () => { zoomPercent = clamp(zoomPercent + 100, 100, 1400); render(); });
        zoomOutButton.addEventListener("click", () => { zoomPercent = clamp(zoomPercent - 100, 100, 1400); render(); });
        zoomViewport.addEventListener("wheel", (event) => {
            if (event.ctrlKey || event.metaKey || event.deltaY === 0) return;
            event.preventDefault();
            const next = clamp(zoomPercent - Math.sign(event.deltaY) * 100, 100, 1400);
            if (next !== zoomPercent) {
                zoomPercent = next;
                render();
            }
        }, { passive: false });
        zoomResetButton.addEventListener("click", resetView);
        sampleButton.addEventListener("click", buildSampleImage);
        imageUploadInput.addEventListener("change", () => { const file = imageUploadInput.files[0]; if (file) loadImageFromFile(file); });
        zoomViewport.addEventListener("pointerdown", (event) => {
            if (event.button !== 0 || !event.isPrimary) return;
            panStart = { id: event.pointerId, x: event.clientX, y: event.clientY, offsetX, offsetY };
        });
        window.addEventListener("pointermove", (event) => {
            if (event.pointerId !== panStart?.id) return;
            const dx = event.clientX - panStart.x;
            const dy = event.clientY - panStart.y;
            if (!dragging && Math.hypot(dx, dy) < 6) return;
            dragging = true;
            zoomViewport.classList.add("dragging");
            offsetX = panStart.offsetX - dx;
            offsetY = panStart.offsetY - dy;
            render();
        });
        function stopDragging(event) {
            if (event.pointerId !== panStart?.id) return;
            panStart = null;
            dragging = false;
            zoomViewport.classList.remove("dragging");
        }
        window.addEventListener("pointerup", stopDragging);
        window.addEventListener("pointercancel", stopDragging);
        zoomViewport.addEventListener("keydown", (event) => {
            const directions = { ArrowLeft: [-32, 0], ArrowRight: [32, 0], ArrowUp: [0, -32], ArrowDown: [0, 32] };
            const direction = directions[event.key];
            if (!Array.isArray(direction)) return;
            event.preventDefault();
            offsetX += direction[0];
            offsetY += direction[1];
            clampOffsets();
            const bounds = zoomViewport.getBoundingClientRect();
            samplePoint = sourcePointFromClient(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
            render();
        });
        zoomCanvas.addEventListener("pointermove", (event) => { samplePoint = sourcePointFromClient(event.clientX, event.clientY); render(); });
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        buildSampleImage(); resizeCanvas(); window.addEventListener("resize", resizeCanvas);
