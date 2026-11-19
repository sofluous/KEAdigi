        const sampleButtons = document.getElementById("sampleButtons");
        const folderGrid = document.getElementById("folderGrid");
        const fileNameInput = document.getElementById("fileNameInput");
        const fileTypeSelect = document.getElementById("fileTypeSelect");
        const fileNameDisplay = document.getElementById("fileNameDisplay");
        const fileMetaDisplay = document.getElementById("fileMetaDisplay");
        const fileIcon = document.getElementById("fileIcon");
        const pathDisplay = document.getElementById("pathDisplay");
        const fileHud = document.getElementById("fileHud");
        const typeHud = document.getElementById("typeHud");
        const folderHud = document.getElementById("folderHud");
        const pathHud = document.getElementById("pathHud");
        const resetButton = document.getElementById("resetButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        const folders = [
            { id: "inbox", label: "Inbox", copy: "Files to organize" },
            { id: "images", label: "Images", copy: "Pictures and graphics" },
            { id: "writing", label: "Writing", copy: "Stories and notes" },
            { id: "audio", label: "Audio", copy: "Songs and sounds" },
            { id: "school", label: "School", copy: "Class projects" }
        ];
        const fileTypes = {
            png: { label: "PNG", description: "Image file", color: "#8ed8ff" },
            txt: { label: "TXT", description: "Text file", color: "#ffd978" },
            mp3: { label: "MP3", description: "Audio file", color: "#ff9ac5" },
            html: { label: "HTML", description: "Web page file", color: "#7df0b4" }
        };
        const samples = [
            { name: "Poster", type: "png", folder: "images" },
            { name: "Song", type: "mp3", folder: "audio" },
            { name: "Journal", type: "txt", folder: "writing" },
            { name: "Project", type: "html", folder: "school" }
        ];
        let currentSampleIndex = 0;
        let state = { ...samples[0], folder: "inbox" };
        function currentType() { return fileTypes[state.type]; }
        function folderById(id) { return folders.find((folder) => folder.id === id); }
        function renderFolderButtons() {
            folderGrid.innerHTML = "";
            folders.forEach((folder) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "folder-card kea-button kea-button--secondary";
                button.dataset.folder = folder.id;
                button.innerHTML = `<span class="folder-icon" aria-hidden="true"></span><span class="folder-name">${folder.label}</span><span class="folder-copy">${folder.copy}</span>`;
                button.addEventListener("click", () => { state.folder = folder.id; render(); });
                folderGrid.appendChild(button);
            });
        }
        function renderSampleButtons() {
            sampleButtons.innerHTML = "";
            samples.forEach((sample, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "kea-button kea-button--secondary";
                button.textContent = sample.name;
                button.addEventListener("click", () => {
                    currentSampleIndex = index;
                    state = { ...samples[index], folder: "inbox" };
                    fileNameInput.value = state.name;
                    fileTypeSelect.value = state.type;
                    render();
                });
                sampleButtons.appendChild(button);
            });
        }
        function renderTypeOptions() {
            fileTypeSelect.innerHTML = "";
            Object.entries(fileTypes).forEach(([key, value]) => {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = `${value.label} - ${value.description}`;
                fileTypeSelect.appendChild(option);
            });
        }
        function render() {
            const example = samples[currentSampleIndex];
            const destination = folderById(example.folder);
            const meaningfulName = state.name !== "Untitled" && state.name.toLowerCase() !== example.name.toLowerCase();
            document.getElementById("fileTask").textContent = `Rename the ${example.name} example without changing its ${fileTypes[example.type].label} format. Move it from Inbox to ${destination.label} so you can find it later.`;
            const feedback = !meaningfulName ? "Try a name that helps you tell what is inside."
                : state.type !== example.type ? "Choose the original format. Renaming a file extension does not convert it."
                : state.folder !== example.folder ? `Move it to ${destination.label}.`
                : "Organized! Use the path below the folders to explain how you would find this file again.";
            const feedbackNode = document.getElementById("fileTaskFeedback");
            if (feedbackNode.textContent !== feedback) feedbackNode.textContent = feedback;

            const folder = folderById(state.folder);
            const type = currentType();
            const fileName = `${state.name}.${state.type}`;
            fileNameDisplay.textContent = fileName;
            fileMetaDisplay.textContent = `${type.label} ${type.description.toLowerCase()}`;
            fileIcon.textContent = type.label;
            fileIcon.style.background = `linear-gradient(180deg, rgba(255,255,255,0.95), ${type.color})`;
            const path = `${folder.label}/${fileName}`;
            pathDisplay.textContent = path;
            fileHud.textContent = state.name;
            typeHud.textContent = type.label;
            folderHud.textContent = folder.label;
            pathHud.textContent = path;
            for (const button of folderGrid.children) {
                const active = button.dataset.folder === state.folder;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            }
        }
        fileNameInput.addEventListener("input", () => {
            state.name = fileNameInput.value.trim() || "Untitled";
            render();
        });
        fileTypeSelect.addEventListener("input", () => {
            state.type = fileTypeSelect.value;
            render();
        });
        resetButton.addEventListener("click", () => {
            state = { ...samples[currentSampleIndex], folder: "inbox" };
            fileNameInput.value = state.name;
            fileTypeSelect.value = state.type;
            render();
        });
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        renderTypeOptions();
        renderSampleButtons();
        renderFolderButtons();
        fileNameInput.value = state.name;
        fileTypeSelect.value = state.type;
        render();
