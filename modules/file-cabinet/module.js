        const deck = window.KEADigiDecks.fileCabinet;
        const roundValue = document.getElementById("roundValue");
        const sortedValue = document.getElementById("sortedValue");
        const scoreValue = document.getElementById("scoreValue");
        const streakValue = document.getElementById("streakValue");
        const promptScreen = document.getElementById("promptScreen");
        const fileTray = document.getElementById("fileTray");
        const folderGrid = document.getElementById("folderGrid");
        const feedbackScreen = document.getElementById("feedbackScreen");
        const newRoundButton = document.getElementById("newRoundButton");
        const clearRoundButton = document.getElementById("clearRoundButton");
        const nextRoundButton = document.getElementById("nextRoundButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");

        let roundIndex = 0;
        let score = 0;
        let streak = 0;
        let selectedFileId = null;
        let placedById = {};

        function currentRound() {
            return deck.rounds[roundIndex];
        }

        function setFeedback(title, body) {
            feedbackScreen.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
        }

        function updateHud() {
            const round = currentRound();
            roundValue.textContent = `${roundIndex + 1} / ${deck.rounds.length}`;
            sortedValue.textContent = `${Object.keys(placedById).length} / ${round.files.length}`;
            scoreValue.textContent = String(score);
            streakValue.textContent = String(streak);
        }

        function fileCardMarkup(file) {
            const tag = file.name.split(".").pop().toUpperCase();
            return `
                <span class="file-card__tag">${tag}</span>
                <p class="file-card__name">${file.name}</p>
                <p class="file-card__type">${file.type}</p>
            `;
        }

        function renderTray() {
            const round = currentRound();
            fileTray.innerHTML = "";

            round.files.forEach((file) => {
                const slot = document.createElement("div");
                slot.className = "file-slot";

                if (placedById[file.id]) {
                    slot.innerHTML = '<div class="file-placeholder" aria-hidden="true"></div>';
                } else {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "kea-button kea-button--secondary file-card";
                    if (selectedFileId === file.id) button.classList.add("active");
                    button.innerHTML = fileCardMarkup(file);
                    button.addEventListener("click", () => {
                        selectedFileId = file.id;
                        setFeedback("File Selected", `Place ${file.name} into the folder where it belongs.`);
                        renderTray();
                    });
                    slot.appendChild(button);
                }

                fileTray.appendChild(slot);
            });
        }

        function placeFile(folderId) {
            if (!selectedFileId) {
                setFeedback("Select A File", "Pick a file from the tray before choosing a folder.");
                return;
            }

            const round = currentRound();
            const file = round.files.find((item) => item.id === selectedFileId);
            const folder = round.folders.find((item) => item.id === folderId);

            if (!file || !folder) return;

            if (file.folderId === folderId) {
                placedById[file.id] = folderId;
                score += 1;
                streak += 1;
                setFeedback("Sorted", `${file.detail} ${file.name} belongs in ${folder.label}.`);
                selectedFileId = null;
            } else {
                streak = 0;
                setFeedback("Try Again", `${file.name} does not belong in ${folder.label}. ${file.detail}`);
            }

            renderRoundState();
        }

        function renderFolders() {
            const round = currentRound();
            folderGrid.innerHTML = "";

            round.folders.forEach((folder) => {
                const card = document.createElement("section");
                card.className = "folder-card kea-console-well";

                const head = document.createElement("div");
                head.className = "folder-head";
                head.innerHTML = `
                    <div>
                        <p class="folder-name">${folder.label}</p>
                        <p class="folder-hint">${folder.hint}</p>
                    </div>
                    <span class="folder-mark">${folder.mark}</span>
                `;

                const slots = document.createElement("div");
                slots.className = "folder-slots";

                const placedFiles = round.files.filter((file) => placedById[file.id] === folder.id);
                const slotCount = Math.max(2, placedFiles.length || 0);

                for (let index = 0; index < slotCount; index += 1) {
                    const slot = document.createElement("div");
                    slot.className = "folder-slot";

                    const placedFile = placedFiles[index];
                    const dropTarget = document.createElement("button");
                    dropTarget.type = "button";
                    dropTarget.className = "folder-drop";
                    dropTarget.addEventListener("click", () => placeFile(folder.id));

                    if (placedFile) {
                        dropTarget.classList.add("folder-drop--filled");
                        dropTarget.innerHTML = fileCardMarkup(placedFile);
                        dropTarget.disabled = true;
                    } else {
                        dropTarget.textContent = folder.label;
                    }

                    slot.appendChild(dropTarget);
                    slots.appendChild(slot);
                }

                card.append(head, slots);
                folderGrid.appendChild(card);
            });
        }

        function renderRoundState() {
            const round = currentRound();
            promptScreen.innerHTML = `<strong>${round.promptTitle}</strong><p>${round.promptText}</p>`;
            renderTray();
            renderFolders();
            updateHud();
            nextRoundButton.disabled = Object.keys(placedById).length !== round.files.length;
        }

        function loadRound(index, resetScore) {
            roundIndex = index;
            placedById = {};
            selectedFileId = null;
            if (resetScore) {
                score = 0;
                streak = 0;
            }
            setFeedback("Ready", "Select a file from the tray, then tap the folder where it belongs.");
            renderRoundState();
        }

        nextRoundButton.addEventListener("click", () => {
            const nextIndex = (roundIndex + 1) % deck.rounds.length;
            loadRound(nextIndex, false);
        });

        newRoundButton.addEventListener("click", () => {
            const nextIndex = (roundIndex + 1) % deck.rounds.length;
            loadRound(nextIndex, false);
        });

        clearRoundButton.addEventListener("click", () => {
            placedById = {};
            selectedFileId = null;
            streak = 0;
            setFeedback("Round Cleared", "The tray is ready again. Pick a file and try sorting it.");
            renderRoundState();
        });

        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => {
            if (event.target === helpOverlay) helpOverlay.hidden = true;
        });

        loadRound(0, true);
