        const splitCanvas = document.getElementById("splitCanvas");
        const blendCanvas = document.getElementById("blendCanvas");
        const splitCtx = splitCanvas.getContext("2d");
        const blendCtx = blendCanvas.getContext("2d");
        const topAlphaSlider = document.getElementById("topAlphaSlider");
        const bottomAlphaSlider = document.getElementById("bottomAlphaSlider");
        const topAlphaValue = document.getElementById("topAlphaValue");
        const bottomAlphaValue = document.getElementById("bottomAlphaValue");
        const topAlphaHud = document.getElementById("topAlphaHud");
        const bottomAlphaHud = document.getElementById("bottomAlphaHud");
        const overlapHud = document.getElementById("overlapHud");
        const resultHud = document.getElementById("resultHud");
        const shapeButtons = document.getElementById("shapeButtons");
        const resetButton = document.getElementById("resetButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const shapeModes = [{ id: "circle", label: "Circles" }, { id: "square", label: "Squares" }, { id: "diamond", label: "Diamonds" }];
        let currentShape = "circle";
        function drawShape(ctx, mode, x, y, size, color, alpha) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            if (mode === "circle") ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            if (mode === "square") ctx.rect(x - size / 2, y - size / 2, size, size);
            if (mode === "diamond") { ctx.moveTo(x, y - size / 2); ctx.lineTo(x + size / 2, y); ctx.lineTo(x, y + size / 2); ctx.lineTo(x - size / 2, y); ctx.closePath(); }
            ctx.fill();
            ctx.restore();
        }
        function renderShapeButtons() {
            shapeButtons.innerHTML = "";
            shapeModes.forEach((mode) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "kea-button kea-button--secondary";
                button.textContent = mode.label;
                button.setAttribute("aria-pressed", String(mode.id === currentShape));
                if (mode.id === currentShape) button.classList.add("is-active");
                button.addEventListener("click", () => { currentShape = mode.id; renderShapeButtons(); render(); });
                shapeButtons.appendChild(button);
            });
        }
        function render() {
            const topAlpha = Number(topAlphaSlider.value) / 100;
            const bottomAlpha = Number(bottomAlphaSlider.value) / 100;
            topAlphaValue.textContent = `${Math.round(topAlpha * 100)}%`;
            bottomAlphaValue.textContent = `${Math.round(bottomAlpha * 100)}%`;
            topAlphaHud.textContent = `${Math.round(topAlpha * 100)}%`;
            bottomAlphaHud.textContent = `${Math.round(bottomAlpha * 100)}%`;
            overlapHud.textContent = topAlpha > 0 && bottomAlpha > 0 ? "Partial" : "Hidden";
            resultHud.textContent = topAlpha > 0.8 ? "Strong top" : topAlpha < 0.3 ? "Lower shows" : "Blend";
            [splitCtx, blendCtx].forEach((ctx) => { ctx.clearRect(0, 0, 420, 420); ctx.fillStyle = "#121418"; ctx.fillRect(0, 0, 420, 420); });
            drawShape(splitCtx, currentShape, 120, 210, 150, "#29adff", bottomAlpha);
            drawShape(splitCtx, currentShape, 300, 210, 150, "#ff5c93", topAlpha);
            drawShape(blendCtx, currentShape, 165, 210, 180, "#29adff", bottomAlpha);
            drawShape(blendCtx, currentShape, 255, 210, 180, "#ff5c93", topAlpha);
        }
        resetButton.addEventListener("click", () => { topAlphaSlider.value = "70"; bottomAlphaSlider.value = "100"; currentShape = "circle"; renderShapeButtons(); render(); });
        [topAlphaSlider, bottomAlphaSlider].forEach((slider) => slider.addEventListener("input", render));
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        renderShapeButtons();
        render();
