        const layerCanvas = document.getElementById("layerCanvas"), ctx = layerCanvas.getContext("2d");
        const layerPreviewShell = layerCanvas.parentElement;
        const layerList = document.getElementById("layerList"), layerCountValue = document.getElementById("layerCountValue");
        const visibleCountValue = document.getElementById("visibleCountValue"), topLayerValue = document.getElementById("topLayerValue"), focusValue = document.getElementById("focusValue");
        const resetLayersButton = document.getElementById("resetLayersButton"), helpButton = document.getElementById("helpButton"), closeHelpButton = document.getElementById("closeHelpButton"), helpOverlay = document.getElementById("helpOverlay");
        const baseLayers = [
            { id:"sky", name:"Sky", color:"#8ed8ff", opacity:100, visible:true },
            { id:"mountains", name:"Mountains", color:"#6d5f88", opacity:100, visible:true },
            { id:"trees", name:"Trees", color:"#167247", opacity:100, visible:true },
            { id:"foreground", name:"Foreground", color:"#ffb347", opacity:100, visible:true }
        ];
        let layers = baseLayers.map((layer) => ({ ...layer }));
        function drawLayer(layer) {
            ctx.save(); ctx.globalAlpha = layer.opacity / 100;
            if (layer.id === "sky") { const gradient = ctx.createLinearGradient(0,0,0,600); gradient.addColorStop(0,"#8ed8ff"); gradient.addColorStop(1,"#f6d36c"); ctx.fillStyle = gradient; ctx.fillRect(0,0,800,600); ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(110,90,46,0,Math.PI*2); ctx.fill(); }
            if (layer.id === "mountains") { ctx.fillStyle = "#5b4d74"; ctx.beginPath(); ctx.moveTo(0,430); ctx.lineTo(170,180); ctx.lineTo(330,430); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(230,430); ctx.lineTo(460,150); ctx.lineTo(690,430); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(520,430); ctx.lineTo(720,220); ctx.lineTo(800,430); ctx.closePath(); ctx.fill(); }
            if (layer.id === "trees") { ctx.fillStyle = "#155733"; for (let i = 0; i < 10; i += 1) { const x = 40 + (i * 72); ctx.beginPath(); ctx.moveTo(x,470); ctx.lineTo(x + 28,320); ctx.lineTo(x + 56,470); ctx.closePath(); ctx.fill(); } }
            if (layer.id === "foreground") { ctx.fillStyle = "#ffb347"; ctx.fillRect(0,470,800,130); ctx.fillStyle = "#a8512b"; ctx.fillRect(540,370,36,120); ctx.fillStyle = "#f25d4c"; ctx.beginPath(); ctx.arc(558,342,46,0,Math.PI*2); ctx.fill(); }
            ctx.restore();
        }
        function renderScene() { ctx.clearRect(0,0,800,600); layers.forEach((layer) => { if (layer.visible) drawLayer(layer); }); }
        function fitLayerCanvas() {
            const rect = layerPreviewShell.getBoundingClientRect();
            const availableWidth = Math.max(0, rect.width - 8);
            const availableHeight = Math.max(0, rect.height - 8);
            const aspectRatio = 4 / 3;
            let width = availableWidth;
            let height = width / aspectRatio;
            if (height > availableHeight) {
                height = availableHeight;
                width = height * aspectRatio;
            }
            layerCanvas.style.width = `${Math.floor(width)}px`;
            layerCanvas.style.height = `${Math.floor(height)}px`;
        }
        function updateHud() { const visibleLayers = layers.filter((layer) => layer.visible); layerCountValue.textContent = String(layers.length); visibleCountValue.textContent = String(visibleLayers.length); topLayerValue.textContent = visibleLayers.at(-1)?.name || "None"; focusValue.textContent = visibleLayers.length === layers.length ? "Order matters" : "Hidden parts"; }
        function moveLayer(index, direction) { const target = index + direction; if (target < 0 || target >= layers.length) return; [layers[index], layers[target]] = [layers[target], layers[index]]; renderAll(); }
        function renderLayerList() {
            layerList.innerHTML = "";
            layers.forEach((layer, index) => {
                const item = document.createElement("section");
                item.className = "layer-item kea-console-well";
                item.dataset.layer = layer.id;
                const opacityId = `opacity-${layer.id}`;
                item.innerHTML = `<div class="layer-item__head"><span class="layer-badge" style="background:${layer.color};"></span><div><p class="layer-name">${layer.name}</p><p class="layer-caption">${index === layers.length - 1 ? "Currently on top" : "Below another layer"}</p></div></div><div class="kea-range-field kea-range-field--inline"><label for="${opacityId}"><span class="visually-hidden">${layer.name} </span>Opacity</label><input id="${opacityId}" type="range" min="0" max="100" value="${layer.opacity}" /></div><div class="kea-segmented"><button class="kea-button kea-button--secondary" type="button" data-role="toggle">${layer.visible ? "Hide" : "Show"}</button><button class="kea-button kea-button--secondary" type="button" data-role="up">Up</button><button class="kea-button kea-button--secondary" type="button" data-role="down">Down</button></div>`;
                const grip = document.createElement("span");
                grip.className = "layer-grip kea-button kea-button--secondary";
                grip.textContent = "⠿";
                grip.title = "Drag to reorder";
                grip.setAttribute("aria-hidden", "true");
                item.querySelector(".layer-item__head").appendChild(grip);
                let dropTarget = null;
                let scrollFrame = 0;
                let pointer = null;
                let gripStart = null;
                function updateDropTarget() {
                    const target = document.elementFromPoint(pointer.clientX, pointer.clientY)?.closest(".layer-item");
                    const next = target && target !== item ? target : null;
                    if (next === dropTarget) return;
                    dropTarget?.classList.remove("is-drop-target");
                    dropTarget = next;
                    dropTarget?.classList.add("is-drop-target");
                }
                function scrollNearEdge() {
                    if (!grip.isConnected || !pointer) return;
                    const bounds = layerList.getBoundingClientRect();
                    const y = pointer.clientY;
                    const previousScroll = layerList.scrollTop;
                    if (pointer.clientX >= bounds.left && pointer.clientX <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
                        if (y < bounds.top + 28) layerList.scrollTop -= 8;
                        else if (y > bounds.bottom - 28) layerList.scrollTop += 8;
                    }
                    if (layerList.scrollTop !== previousScroll) updateDropTarget();
                    scrollFrame = requestAnimationFrame(scrollNearEdge);
                }
                grip.addEventListener("pointerdown", (event) => {
                    if (event.button !== 0) return;
                    grip.setPointerCapture(event.pointerId);
                    gripStart = event;
                });
                grip.addEventListener("pointermove", (event) => {
                    if (!grip.hasPointerCapture(event.pointerId)) return;
                    if (!pointer) {
                        if (!gripStart || Math.hypot(event.clientX - gripStart.clientX, event.clientY - gripStart.clientY) < 6) return;
                        scrollFrame = requestAnimationFrame(scrollNearEdge);
                    }
                    pointer = event;
                    updateDropTarget();
                });
                grip.addEventListener("pointerup", (event) => {
                    if (!pointer || !grip.hasPointerCapture(event.pointerId)) return;
                    pointer = event;
                    updateDropTarget();
                    if (!dropTarget) return;
                    const index = layers.indexOf(layer);
                    const targetIndex = layers.findIndex((candidate) => candidate.id === dropTarget.dataset.layer);
                    layers.splice(index, 1);
                    layers.splice(targetIndex, 0, layer);
                    renderAll();
                });
                grip.addEventListener("lostpointercapture", () => {
                    cancelAnimationFrame(scrollFrame);
                    pointer = null;
                    gripStart = null;
                    dropTarget?.classList.remove("is-drop-target");
                    dropTarget = null;
                });
                item.querySelector("input").addEventListener("input", (event) => {
                    layer.opacity = Number(event.target.value);
                    renderScene();
                });
                item.querySelector('[data-role="toggle"]').addEventListener("click", () => { layer.visible = !layer.visible; renderAll(); });
                item.querySelector('[data-role="up"]').addEventListener("click", () => moveLayer(index, 1));
                item.querySelector('[data-role="down"]').addEventListener("click", () => moveLayer(index, -1));
                layerList.appendChild(item);
            });
        }
        function renderAll() { renderScene(); renderLayerList(); updateHud(); }
        resetLayersButton.addEventListener("click", () => { layers = baseLayers.map((layer) => ({ ...layer })); renderAll(); });
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        renderAll();
        fitLayerCanvas();
        window.addEventListener("resize", fitLayerCanvas);
