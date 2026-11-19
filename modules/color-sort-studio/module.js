        const ROUNDS = [
            [
                { id: "tomato", name: "Tomato", hex: "#ff5a36", group: "warm" },
                { id: "sunbeam", name: "Sunbeam", hex: "#ffd84b", group: "warm" },
                { id: "apricot", name: "Apricot", hex: "#ffb173", group: "warm" },
                { id: "lagoon", name: "Lagoon", hex: "#1fa7d8", group: "cool" },
                { id: "mint", name: "Mint", hex: "#7de2b1", group: "cool" },
                { id: "violet", name: "Violet", hex: "#6d73ff", group: "cool" },
                { id: "stone", name: "Stone", hex: "#a7a39a", group: "neutral" },
                { id: "sand", name: "Sand", hex: "#dfc29f", group: "neutral" },
                { id: "walnut", name: "Walnut", hex: "#8d6541", group: "neutral" }
            ],
            [
                { id: "rose", name: "Rose", hex: "#ff7691", group: "warm" },
                { id: "gold", name: "Gold", hex: "#f2b630", group: "warm" },
                { id: "peach", name: "Peach", hex: "#ffc49a", group: "warm" },
                { id: "ocean", name: "Ocean", hex: "#267dff", group: "cool" },
                { id: "ice", name: "Ice", hex: "#bfefff", group: "cool" },
                { id: "fern", name: "Fern", hex: "#43b97c", group: "cool" },
                { id: "charcoal", name: "Charcoal", hex: "#6a6872", group: "neutral" },
                { id: "linen", name: "Linen", hex: "#f4e7d1", group: "neutral" },
                { id: "cocoa", name: "Cocoa", hex: "#71513e", group: "neutral" }
            ],
            [
                { id: "ember", name: "Ember", hex: "#ff6c2f", group: "warm" },
                { id: "lemon", name: "Lemon", hex: "#fff064", group: "warm" },
                { id: "coral", name: "Coral", hex: "#ff9186", group: "warm" },
                { id: "aqua", name: "Aqua", hex: "#40d8df", group: "cool" },
                { id: "indigo", name: "Indigo", hex: "#515ae7", group: "cool" },
                { id: "spruce", name: "Spruce", hex: "#2d8a73", group: "cool" },
                { id: "fog", name: "Fog", hex: "#c5c6cc", group: "neutral" },
                { id: "clay", name: "Clay", hex: "#b48f74", group: "neutral" },
                { id: "ash", name: "Ash", hex: "#8a837e", group: "neutral" }
            ]
        ];

        const GROUPS = [
            { id: "warm", label: "Warm" },
            { id: "cool", label: "Cool" },
            { id: "neutral", label: "Neutral" }
        ];

        const roundValue = document.getElementById("roundValue");
        const sortedValue = document.getElementById("sortedValue");
        const scoreValue = document.getElementById("scoreValue");
        const streakValue = document.getElementById("streakValue");
        const swatchTray = document.getElementById("swatchTray");
        const bucketGrid = document.getElementById("bucketGrid");
        const feedbackScreen = document.getElementById("feedbackScreen");
        const clearButton = document.getElementById("clearButton");
        const nextRoundButton = document.getElementById("nextRoundButton");
        const newRoundButton = document.getElementById("newRoundButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");

        let roundIndex = 0;
        let score = 0;
        let streak = 0;
        let availableRounds = [];
        let currentRound = [];
        let selectedSwatchId = null;
        let placements = {};

        function shuffle(items) {
            const clone = [...items];
            for (let i = clone.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [clone[i], clone[j]] = [clone[j], clone[i]];
            }
            return clone;
        }

        function getSwatchById(id) {
            return currentRound.find((swatch) => swatch.id === id);
        }

        function buildBuckets() {
            bucketGrid.innerHTML = "";
            GROUPS.forEach((group) => {
                const count = Object.values(placements).filter((value) => value === group.id).length;
                const groupedSwatches = currentRound.filter((swatch) => placements[swatch.id] === group.id);
                const bucket = document.createElement("button");
                bucket.type = "button";
                bucket.className = "bucket kea-surface";
                bucket.dataset.group = group.id;
                bucket.innerHTML = `
                    <div class="bucket-head">
                        <p class="bucket-label kea-console-label">${group.label}</p>
                        <p class="bucket-count">${count} sorted</p>
                    </div>
                    <div class="bucket-slots"></div>
                `;
                bucket.addEventListener("click", () => placeSelectedSwatch(group.id));

                const slotHost = bucket.querySelector(".bucket-slots");
                const bucketCapacity = 6;
                for (let index = 0; index < bucketCapacity; index += 1) {
                    const slot = document.createElement("div");
                    slot.className = "bucket-slot";
                    const swatch = groupedSwatches[index];
                    if (swatch) {
                        slot.classList.add("placed-swatch");
                        slot.innerHTML = `
                            <span class="placed-swatch__chip" style="background:${swatch.hex}"></span>
                            <p class="placed-swatch__name">${swatch.name}</p>
                        `;
                    } else {
                        slot.classList.add("bucket-slot--empty");
                    }
                    slotHost.appendChild(slot);
                }

                bucketGrid.appendChild(bucket);
            });
        }

        function buildTray() {
            swatchTray.innerHTML = "";
            currentRound.forEach((swatch) => {
                const slot = document.createElement("div");
                slot.className = "swatch-slot";
                if (placements[swatch.id]) {
                    slot.classList.add("swatch-slot--empty");
                    swatchTray.appendChild(slot);
                    return;
                }

                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "swatch-card";
                    if (selectedSwatchId === swatch.id) button.classList.add("is-selected");
                    button.innerHTML = `
                        <span class="swatch-chip" style="background:${swatch.hex}"></span>
                        <p class="swatch-name">${swatch.name}</p>
                    `;
                    button.addEventListener("click", () => {
                        selectedSwatchId = selectedSwatchId === swatch.id ? null : swatch.id;
                        updateBoard();
                    });
                    slot.appendChild(button);
                    swatchTray.appendChild(slot);
                });
        }

        function updateHud() {
            const sortedCount = Object.keys(placements).length;
            roundValue.textContent = String(roundIndex + 1);
            sortedValue.textContent = `${sortedCount} / ${currentRound.length}`;
            scoreValue.textContent = String(score);
            streakValue.textContent = String(streak);
            nextRoundButton.disabled = sortedCount !== currentRound.length;
        }

        function updateBoard() {
            buildTray();
            buildBuckets();
            updateHud();
        }

        function finishRound() {
            const correct = currentRound.every((swatch) => placements[swatch.id] === swatch.group);
            if (correct) {
                score += currentRound.length;
                streak += 1;
                feedbackScreen.innerHTML = "<strong>Sorted</strong><p>You grouped the colors correctly. Warm, cool, and neutral are all in the right places.</p>";
            } else {
                streak = 0;
                feedbackScreen.innerHTML = "<strong>Almost</strong><p>Some swatches are in the wrong group. Clear the board and try again.</p>";
            }
            updateHud();
        }

        function placeSelectedSwatch(groupId) {
            if (!selectedSwatchId) {
                feedbackScreen.innerHTML = "<strong>Select a swatch</strong><p>Pick a color from the tray first, then tap a color group.</p>";
                return;
            }

            placements[selectedSwatchId] = groupId;
            const swatch = getSwatchById(selectedSwatchId);
            if (swatch.group === groupId) {
                feedbackScreen.innerHTML = `<strong>Nice sort</strong><p>${swatch.name} fits in the ${groupId} group.</p>`;
            } else {
                feedbackScreen.innerHTML = `<strong>Check this one</strong><p>${swatch.name} may belong in a different group.</p>`;
            }
            selectedSwatchId = null;
            updateBoard();

            if (Object.keys(placements).length === currentRound.length) finishRound();
        }

        function startRound(index) {
            roundIndex = index;
            if (!availableRounds.length) availableRounds = shuffle(ROUNDS);
            currentRound = shuffle(availableRounds.pop()).map((swatch) => ({ ...swatch }));
            selectedSwatchId = null;
            placements = {};
            feedbackScreen.innerHTML = "<strong>Ready</strong><p>Select a swatch from the tray, then tap the group where it belongs.</p>";
            updateBoard();
        }

        function nextRound() {
            startRound((roundIndex + 1) % ROUNDS.length);
        }

        clearButton.addEventListener("click", () => {
            selectedSwatchId = null;
            placements = {};
            feedbackScreen.innerHTML = "<strong>Cleared</strong><p>The palette is back in the tray. Try sorting again.</p>";
            updateBoard();
        });

        nextRoundButton.addEventListener("click", nextRound);
        newRoundButton.addEventListener("click", nextRound);
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => {
            if (event.target === helpOverlay) helpOverlay.hidden = true;
        });

        startRound(0);
