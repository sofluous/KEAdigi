        let fitToViewActive = true;
        let pointerHandledToolbarTarget = null;

        const keyboard = document.getElementById("keyboard");
        const scaleSlider = document.getElementById("scaleSlider");
        const physicalKeyMap = new Map();
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");

        const keyData = [
            [{ label: "Esc", type: "control", size: 2 }, { label: "F1", type: "function", size: 1 }, { label: "F2", type: "function", size: 1 },
            { label: "F3", type: "function", size: 1 }, { label: "F4", type: "function", size: 1 }, { label: "F5", type: "function", size: 1 },
            { label: "F6", type: "function", size: 1 }, { label: "F7", type: "function", size: 1 }, { label: "F8", type: "function", size: 1 },
            { label: "F9", type: "function", size: 1 }, { label: "F10", type: "function", size: 1 }, { label: "F11", type: "function", size: 1 },
            { label: "F12", type: "function", size: 1 }, { label: "Del", type: "control", size: 1 }],

            [{ label: "`", type: "alphanumeric", size: 1 }, { label: "1", type: "alphanumeric", size: 1 }, { label: "2", type: "alphanumeric", size: 1 },
            { label: "3", type: "alphanumeric", size: 1 }, { label: "4", type: "alphanumeric", size: 1 }, { label: "5", type: "alphanumeric", size: 1 },
            { label: "6", type: "alphanumeric", size: 1 }, { label: "7", type: "alphanumeric", size: 1 }, { label: "8", type: "alphanumeric", size: 1 },
            { label: "9", type: "alphanumeric", size: 1 }, { label: "0", type: "alphanumeric", size: 1 }, { label: "-", type: "alphanumeric", size: 1 },
            { label: "=", type: "alphanumeric", size: 1 }, { label: "Backspace", type: "control", size: 2 }],

            [{ label: "Tab", type: "control", size: 1.5 }, { label: "Q", type: "alphanumeric", size: 1 }, { label: "W", type: "alphanumeric", size: 1 },
            { label: "E", type: "alphanumeric", size: 1 }, { label: "R", type: "alphanumeric", size: 1 }, { label: "T", type: "alphanumeric", size: 1 },
            { label: "Y", type: "alphanumeric", size: 1 }, { label: "U", type: "alphanumeric", size: 1 }, { label: "I", type: "alphanumeric", size: 1 },
            { label: "O", type: "alphanumeric", size: 1 }, { label: "P", type: "alphanumeric", size: 1 }, { label: "[", type: "alphanumeric", size: 1 },
            { label: "]", type: "alphanumeric", size: 1 }, { label: "\\", type: "alphanumeric", size: 1.5 }],

            [{ label: "CapsLock", type: "modifier", size: 1.75 }, { label: "A", type: "alphanumeric", size: 1 }, { label: "S", type: "alphanumeric", size: 1 },
            { label: "D", type: "alphanumeric", size: 1 }, { label: "F", type: "alphanumeric", size: 1 }, { label: "G", type: "alphanumeric", size: 1 },
            { label: "H", type: "alphanumeric", size: 1 }, { label: "J", type: "alphanumeric", size: 1 }, { label: "K", type: "alphanumeric", size: 1 },
            { label: "L", type: "alphanumeric", size: 1 }, { label: ";", type: "alphanumeric", size: 1 }, { label: "'", type: "alphanumeric", size: 1 },
            { label: "Enter", type: "control", size: 2.25 }],

            [{ label: "Shift", type: "modifier", size: 2.25 }, { label: "Z", type: "alphanumeric", size: 1 }, { label: "X", type: "alphanumeric", size: 1 },
            { label: "C", type: "alphanumeric", size: 1 }, { label: "V", type: "alphanumeric", size: 1 }, { label: "B", type: "alphanumeric", size: 1 },
            { label: "N", type: "alphanumeric", size: 1 }, { label: "M", type: "alphanumeric", size: 1 }, { label: ",", type: "alphanumeric", size: 1 },
            { label: ".", type: "alphanumeric", size: 1 }, { label: "/", type: "alphanumeric", size: 1 }, { label: "Shift", type: "modifier", size: 2.75 }],

            [{ label: "Ctrl", type: "modifier", size: 1.25 }, { label: "Win", type: "modifier", size: 1.25 },
            { label: "Alt", type: "modifier", size: 1.25 }, { label: "Space", type: "special", size: 6.25 },
            { label: "Alt", type: "modifier", size: 1.25 }, { label: "Fn", type: "modifier", size: 1.25 },
            { label: "Menu", type: "special", size: 1.25 }, { label: "Ctrl", type: "modifier", size: 1.25 }]
        ];

        function getAllKeys() {
            return document.querySelectorAll(".key");
        }

        function getCodesForKey(label, rowIndex, keyIndex) {
            if (/^F\d+$/.test(label)) return [label];
            if (/^[A-Z]$/.test(label)) return ["Key" + label];
            if (/^\d$/.test(label)) return ["Digit" + label];

            switch (label) {
                case "Esc": return ["Escape"];
                case "Del": return ["Delete"];
                case "`": return ["Backquote"];
                case "-": return ["Minus"];
                case "=": return ["Equal"];
                case "Backspace": return ["Backspace"];
                case "Tab": return ["Tab"];
                case "[": return ["BracketLeft"];
                case "]": return ["BracketRight"];
                case "\\": return ["Backslash"];
                case "CapsLock": return ["CapsLock"];
                case ";": return ["Semicolon"];
                case "'": return ["Quote"];
                case "Enter": return ["Enter", "NumpadEnter"];
                case "Shift": return [keyIndex === 0 ? "ShiftLeft" : "ShiftRight"];
                case ",": return ["Comma"];
                case ".": return ["Period"];
                case "/": return ["Slash"];
                case "Ctrl": return [keyIndex === 0 ? "ControlLeft" : "ControlRight"];
                case "Win": return ["MetaLeft"];
                case "Alt": return [keyIndex < 4 ? "AltLeft" : "AltRight"];
                case "Space": return ["Space"];
                case "Fn": return [];
                case "Menu": return ["ContextMenu"];
                default: return [];
            }
        }

        function createKeyboard() {
            keyData.forEach((row, rowIndex) => {
                const rowDiv = document.createElement("div");
                rowDiv.classList.add("row");

                row.forEach((keyInfo, keyIndex) => {
                    const keyElement = document.createElement("button");
                    keyElement.type = "button";
                    keyElement.classList.add("key", "hidden");
                    keyElement.textContent = keyInfo.label;
                    keyElement.dataset.type = keyInfo.type;
                    keyElement.setAttribute("aria-pressed", "false");
                    keyElement.setAttribute("aria-label", keyInfo.label + " key");

                    keyElement.addEventListener("click", () => {
                        keyElement.classList.toggle("hidden");
                        keyElement.setAttribute("aria-pressed", String(!keyElement.classList.contains("hidden")));
                        updateLabelPillState();
                    });

                    const codes = getCodesForKey(keyInfo.label, rowIndex, keyIndex);
                    if (codes.length) {
                        keyElement.dataset.codes = codes.join(",");
                        codes.forEach(code => physicalKeyMap.set(code, keyElement));
                    }

                    rowDiv.appendChild(keyElement);
                });

                keyboard.appendChild(rowDiv);
            });

            updateKeyboardSize();
        }

        const keyColors = {
            alphanumeric: "#9ed8ff",
            function: "#ffe98e",
            modifier: "#ffc1d7",
            control: "#ffa1a1",
            system: "#d8d8da",
            special: "#b6f2b6"
        };

        function toggleKeyType(type) {
            const keys = document.querySelectorAll(`.key[data-type='${type}']`);
            const button = document.querySelector(`button[data-type='${type}']`);
            const isActive = Array.from(keys).some(key => key.classList.contains(`highlight-${type}`));

            keys.forEach(key => {
                if (isActive) {
                    key.classList.remove(`highlight-${type}`);
                } else {
                    key.classList.add(`highlight-${type}`);
                }
            });

            if (isActive) {
                button.classList.remove("active");
                button.style.backgroundColor = "";
            } else {
                button.classList.add("active");
                button.style.setProperty("--toggle-color", keyColors[type]);
                button.style.backgroundColor = keyColors[type];
            }
        }

        function updateKeyboardSize() {
            const frame = document.querySelector(".keyboard-frame");
            const frameWidth = Math.max(320, (frame ? frame.clientWidth : window.innerWidth) - 56);
            const frameHeight = Math.max(220, (frame ? frame.clientHeight : window.innerHeight) - 56);
            const keyboardPadding = 16;
            const rowGap = 8;
            const totalRows = keyData.length;
            const totalUnits = 15;
            const maxKeysInRow = Math.max(...keyData.map((row) => row.length));
            const widthLimitedKeySize = (frameWidth - (keyboardPadding * 2) - ((maxKeysInRow - 1) * rowGap)) / totalUnits;
            const heightLimitedKeySize = (frameHeight - (keyboardPadding * 2) - ((totalRows - 1) * rowGap)) / totalRows;
            const fitKeySize = Math.max(24, Math.floor(Math.min(widthLimitedKeySize, heightLimitedKeySize, 92)));
            const sliderProgress = (Number(scaleSlider.value) - Number(scaleSlider.min)) / (Number(scaleSlider.max) - Number(scaleSlider.min));
            const scaledKeySize = Math.round(24 + ((fitKeySize - 24) * sliderProgress));
            const standardKeySize = fitToViewActive ? fitKeySize : Math.min(fitKeySize, scaledKeySize);
            const keyboardWidth = Math.round((standardKeySize * totalUnits) + ((maxKeysInRow - 1) * rowGap) + (keyboardPadding * 2));

            const availableWidth = keyboardWidth - (keyboardPadding * 2);
            keyboard.style.width = `${keyboardWidth}px`;
            keyboard.style.padding = `${keyboardPadding}px`;

            document.querySelectorAll(".row").forEach((row, rowIndex) => {
                row.childNodes.forEach((key, keyIndex) => {
                    const keySize = keyData[rowIndex][keyIndex].size || 1;
                    const keyWidth = standardKeySize * keySize;

                    key.style.width = `${keyWidth}px`;
                    key.style.height = `${standardKeySize}px`;
                    key.style.flex = `0 0 ${keyWidth}px`;
                    key.style.fontSize = `${standardKeySize * 0.32}px`;
                });

                row.style.height = `${standardKeySize}px`;
                row.style.maxWidth = `${availableWidth}px`;
            });

            const keyboardHeight = (standardKeySize * totalRows) + (rowGap * (totalRows - 1)) + (keyboardPadding * 2);
            keyboard.style.height = `${keyboardHeight}px`;
            document.documentElement.style.setProperty("--key-size", `${standardKeySize}px`);
        }

        function toggleFitToView() {
            fitToViewActive = true;
            document.getElementById("fitToViewBtn").classList.add("active");
            document.getElementById("scaleBtn").classList.remove("active");
            document.getElementById("scaleSlider").disabled = true;
            updateKeyboardSize();
        }

        function toggleScale() {
            fitToViewActive = false;
            document.getElementById("scaleBtn").classList.add("active");
            document.getElementById("fitToViewBtn").classList.remove("active");
            scaleSlider.disabled = false;
            updateKeyboardSize();
        }

        function toggleShowLabels() {
            getAllKeys().forEach(key => {
                key.classList.remove("hidden");
                key.setAttribute("aria-pressed", "true");
            });
            updateLabelPillState();
        }

        function toggleHideLabels() {
            getAllKeys().forEach(key => {
                key.classList.add("hidden");
                key.setAttribute("aria-pressed", "false");
            });
            updateLabelPillState();
        }

        function updateLabelPillState() {
            const keys = getAllKeys();
            const visibleKeys = keys.length - document.querySelectorAll(".key.hidden").length;

            document.getElementById("showLabelsBtn").classList.toggle("active", visibleKeys === keys.length);
            document.getElementById("hideLabelsBtn").classList.toggle("active", visibleKeys === 0);
        }

        function invokeToolbarAction(action, value) {
            if (action === "fitToView") toggleFitToView();
            if (action === "scale") toggleScale();
            if (action === "showLabels") toggleShowLabels();
            if (action === "hideLabels") toggleHideLabels();
            if (action === "keyType") toggleKeyType(value);
        }

        function handleToolbarPress(event, action, value) {
            event.preventDefault();
            pointerHandledToolbarTarget = event.currentTarget;
            invokeToolbarAction(action, value);
        }

        function handleToolbarClick(event, action, value) {
            if (pointerHandledToolbarTarget === event.currentTarget) {
                pointerHandledToolbarTarget = null;
                event.preventDefault();
                return;
            }
            invokeToolbarAction(action, value);
        }

        window.addEventListener("pointerup", () => {
            requestAnimationFrame(() => {
                pointerHandledToolbarTarget = null;
            });
        });

        function pressPhysicalKey(code) {
            const keyElement = physicalKeyMap.get(code);
            if (!keyElement) return;

            keyElement.classList.add("is-pressed");
            if (keyElement.classList.contains("hidden")) {
                keyElement.dataset.restoreHidden = "true";
                keyElement.classList.remove("hidden");
                updateLabelPillState();
            }
        }

        function releasePhysicalKey(code) {
            const keyElement = physicalKeyMap.get(code);
            if (!keyElement) return;

            keyElement.classList.remove("is-pressed");
            if (keyElement.dataset.restoreHidden === "true") {
                keyElement.classList.add("hidden");
                delete keyElement.dataset.restoreHidden;
                updateLabelPillState();
            }
        }

        window.addEventListener("resize", () => {
            if (fitToViewActive) {
                updateKeyboardSize();
            }
        });

        window.addEventListener("keydown", (event) => {
            pressPhysicalKey(event.code);
        });

        window.addEventListener("keyup", (event) => {
            releasePhysicalKey(event.code);
        });

        window.addEventListener("blur", () => {
            physicalKeyMap.forEach((keyElement) => {
                keyElement.classList.remove("is-pressed");
                if (keyElement.dataset.restoreHidden === "true") {
                    keyElement.classList.add("hidden");
                    delete keyElement.dataset.restoreHidden;
                }
            });
            updateLabelPillState();
        });

        window.onload = () => {
            createKeyboard();
            toggleFitToView();
        };

        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => {
            if (event.target === helpOverlay) helpOverlay.hidden = true;
        });
