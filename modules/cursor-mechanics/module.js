        const modeButtons = document.getElementById("modeButtons");
        const cursorBoard = document.getElementById("cursorBoard");
        const modeTitle = document.getElementById("modeTitle");
        const modeCopy = document.getElementById("modeCopy");
        const modeHud = document.getElementById("modeHud");
        const hoverHud = document.getElementById("hoverHud");
        const dragHud = document.getElementById("dragHud");
        const resizeHud = document.getElementById("resizeHud");
        const resetButton = document.getElementById("resetButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const modes = {
            hover: { label: "Hover", copy: "Move over something without pressing. Hover often reveals that an item can react." },
            click: { label: "Click", copy: "Click selects or activates one item at a time." },
            drag: { label: "Drag", copy: "Dragging moves an item while the pointer stays pressed." },
            resize: { label: "Resize", copy: "Resize changes the size of an item instead of moving it." }
        };
        const examples = {
            hover: ["Preview card", "Reveal label", "Highlight tile"],
            click: ["Toggle switch", "Select card", "Activate key"],
            drag: ["Window", "Sticker", "Note"],
            resize: ["Picture", "Panel", "Text box"]
        };
        let currentMode = "hover";

        function moveExample(example, dx, dy, resize) {
            const bounds = cursorBoard.getBoundingClientRect();
            if (bounds.width === 0 || bounds.height === 0) return;
            const limit = (value, min, max) => Math.max(min, Math.min(max, value));
            if (resize) {
                example.style.width = `${100 * limit(example.offsetWidth + dx, 55, bounds.width - example.offsetLeft) / bounds.width}%`;
                example.style.height = `${100 * limit(example.offsetHeight + dy, 42, bounds.height - example.offsetTop) / bounds.height}%`;
                resizeHud.textContent = "Resized";
            } else {
                example.style.left = `${100 * limit(example.offsetLeft + dx, 0, bounds.width - example.offsetWidth) / bounds.width}%`;
                example.style.top = `${100 * limit(example.offsetTop + dy, 0, bounds.height - example.offsetHeight) / bounds.height}%`;
                dragHud.textContent = "Moved";
            }
        }

        function bindPosition(example, resize) {
            let lastPointer;
            let isMoving = false;
            example.addEventListener("pointerdown", (event) => {
                if (event.button !== 0) return;
                lastPointer = event;
                example.setPointerCapture(event.pointerId);
            });
            example.addEventListener("pointermove", (event) => {
                if (!lastPointer || !example.hasPointerCapture(event.pointerId)) return;
                const dx = event.clientX - lastPointer.clientX;
                const dy = event.clientY - lastPointer.clientY;
                if (!isMoving && Math.hypot(dx, dy) < 6) return;
                isMoving = true;
                moveExample(example, dx, dy, resize);
                lastPointer = event;
            });
            example.addEventListener("lostpointercapture", () => {
                lastPointer = null;
                isMoving = false;
            });
            example.addEventListener("keydown", (event) => {
                const offsets = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
                if (!Object.hasOwn(offsets, event.key)) return;
                event.preventDefault();
                moveExample(example, ...offsets[event.key], resize);
            });
        }

        function setMode(mode) {
            currentMode = mode;
            modeTitle.textContent = modes[mode].label;
            modeCopy.textContent = modes[mode].copy;
            modeHud.textContent = modes[mode].label;
            hoverHud.textContent = "Idle";
            dragHud.textContent = "Ready";
            resizeHud.textContent = "Ready";
            for (const button of modeButtons.children) {
                const active = button.dataset.mode === mode;
                button.setAttribute("aria-pressed", String(active));
                button.classList.toggle("is-active", active);
            }

            cursorBoard.replaceChildren();
            examples[mode].forEach((name, index) => {
                const example = document.createElement("button");
                example.type = "button";
                example.className = "kea-button kea-button--secondary cursor-example";
                example.dataset.action = mode;
                example.textContent = name;
                example.style.left = `${12 + (index % 2) * 46}%`;
                example.style.top = `${12 + Math.floor(index / 2) * 42}%`;
                example.style.width = "30%";
                example.style.height = "28%";
                if (mode === "drag" || mode === "resize") {
                    example.title = "Use arrow keys or drag";
                    bindPosition(example, mode === "resize");
                } else {
                    let selected = false;
                    example.setAttribute("aria-pressed", "false");
                    const present = (active) => {
                        example.classList.toggle("is-highlighted", active);
                        example.textContent = active ? `${name} ? ${mode === "hover" ? "Revealed" : "On"}` : name;
                        hoverHud.textContent = active ? (mode === "hover" ? "Highlight" : "Activated") : "Idle";
                    };
                    if (mode === "hover") {
                        example.addEventListener("pointerenter", (event) => {
                            if (event.pointerType === "mouse") present(true);
                        });
                        example.addEventListener("pointerleave", () => present(selected));
                    }
                    example.addEventListener("click", () => {
                        selected = !selected;
                        example.setAttribute("aria-pressed", String(selected));
                        present(selected);
                    });
                }
                cursorBoard.appendChild(example);
            });
        }

        for (const [key, mode] of Object.entries(modes)) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "kea-button kea-button--secondary";
            button.textContent = mode.label;
            button.dataset.mode = key;
            button.addEventListener("click", () => setMode(key));
            modeButtons.appendChild(button);
        }
        resetButton.addEventListener("click", () => setMode(currentMode));
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        setMode("hover");
