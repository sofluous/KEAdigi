        const historyCanvas = document.getElementById("historyCanvas");
        const historyCtx = historyCanvas.getContext("2d");
        const historyList = document.getElementById("historyList");
        const undoButton = document.getElementById("undoButton");
        const redoButton = document.getElementById("redoButton");
        const resetButton = document.getElementById("resetButton");
        const stepButton = document.getElementById("stepButton");
        const stepHud = document.getElementById("stepHud");
        const undoHud = document.getElementById("undoHud");
        const redoHud = document.getElementById("redoHud");
        const actionHud = document.getElementById("actionHud");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const actions = [
            { label: "Blank canvas", draw: () => {} },
            { label: "Add sky", draw: (ctx) => { ctx.fillStyle = "#8ed8ff"; ctx.fillRect(0, 0, 800, 600); } },
            { label: "Add ground", draw: (ctx) => { ctx.fillStyle = "#8ed8ff"; ctx.fillRect(0, 0, 800, 600); ctx.fillStyle = "#55b15a"; ctx.fillRect(0, 420, 800, 180); } },
            { label: "Add sun", draw: (ctx) => { ctx.fillStyle = "#8ed8ff"; ctx.fillRect(0, 0, 800, 600); ctx.fillStyle = "#55b15a"; ctx.fillRect(0, 420, 800, 180); ctx.fillStyle = "#ffd978"; ctx.beginPath(); ctx.arc(120, 110, 48, 0, Math.PI * 2); ctx.fill(); } },
            { label: "Add mountain", draw: (ctx) => { ctx.fillStyle = "#8ed8ff"; ctx.fillRect(0, 0, 800, 600); ctx.fillStyle = "#55b15a"; ctx.fillRect(0, 420, 800, 180); ctx.fillStyle = "#ffd978"; ctx.beginPath(); ctx.arc(120, 110, 48, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#655b7a"; ctx.beginPath(); ctx.moveTo(180, 420); ctx.lineTo(430, 170); ctx.lineTo(680, 420); ctx.closePath(); ctx.fill(); } },
            { label: "Add tree", draw: (ctx) => { actions[4].draw(ctx); ctx.fillStyle = "#7b4d2a"; ctx.fillRect(560, 310, 26, 110); ctx.fillStyle = "#26a65b"; ctx.beginPath(); ctx.arc(573, 280, 54, 0, Math.PI * 2); ctx.fill(); } },
            { label: "Add cloud", draw: (ctx) => { actions[5].draw(ctx); ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(320, 110, 22, 0, Math.PI * 2); ctx.arc(350, 102, 26, 0, Math.PI * 2); ctx.arc(382, 112, 20, 0, Math.PI * 2); ctx.fill(); } }
        ];
        let currentStep = 1;
        function renderList() {
            historyList.innerHTML = "";
            actions.forEach((action, index) => {
                const item = document.createElement("button");
                item.type = "button";
                item.className = `history-item kea-button kea-button--secondary${index === currentStep ? " is-active" : ""}`;
                item.innerHTML = `<strong>${index}. ${action.label}</strong><p>${index < currentStep ? "Already applied" : index === currentStep ? "Current state" : "Future state"}</p>`;
                item.addEventListener("click", () => { currentStep = index; renderScene(); });
                historyList.appendChild(item);
            });
        }
        function renderScene() {
            historyCtx.clearRect(0, 0, 800, 600);
            actions[currentStep].draw(historyCtx);
            stepHud.textContent = `${currentStep + 1} / ${actions.length}`;
            undoHud.textContent = currentStep > 0 ? "Available" : "Start";
            redoHud.textContent = currentStep < actions.length - 1 ? "Available" : "End";
            actionHud.textContent = actions[currentStep].label;
            renderList();
        }
        undoButton.addEventListener("click", () => { currentStep = Math.max(0, currentStep - 1); renderScene(); });
        redoButton.addEventListener("click", () => { currentStep = Math.min(actions.length - 1, currentStep + 1); renderScene(); });
        stepButton.addEventListener("click", () => { currentStep = Math.min(actions.length - 1, currentStep + 1); renderScene(); });
        resetButton.addEventListener("click", () => { currentStep = 0; renderScene(); });
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        renderScene();
