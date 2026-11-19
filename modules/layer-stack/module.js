        const SHAPE_RENDERERS = {
            sun(layer) {
                return `<div class="shape-shell shape-sun"><div class="shape-body"></div><span class="shape-name">${layer.label}</span></div>`;
            },
            cloud(layer) {
                return `<div class="shape-shell shape-cloud"><div class="shape-body"></div><span class="shape-name">${layer.label}</span></div>`;
            },
            tree(layer) {
                return `<div class="shape-shell shape-tree"><div class="shape-body"></div><span class="shape-name">${layer.label}</span></div>`;
            },
            house(layer) {
                return `<div class="shape-shell shape-house"><div class="shape-body"></div><div class="shape-door"></div><div class="shape-window left"></div><span class="shape-name">${layer.label}</span></div>`;
            },
            boat(layer) {
                return `<div class="shape-shell shape-boat"><div class="shape-body"></div><div class="shape-sail"></div><span class="shape-name">${layer.label}</span></div>`;
            },
            fish(layer) {
                return `<div class="shape-shell shape-fish"><div class="shape-body"></div><div class="shape-tail"></div><div class="shape-eye"></div><span class="shape-name">${layer.label}</span></div>`;
            }
        };

        const SCENES = [
            {
                title: "Sunny Yard",
                layers: [
                    { id: "sun", label: "Sun", type: "sun", x: 8, y: 8, w: 24, h: 24 },
                    { id: "cloud", label: "Cloud", type: "cloud", x: 18, y: 10, w: 34, h: 22 },
                    { id: "tree", label: "Tree", type: "tree", x: 55, y: 22, w: 24, h: 48 },
                    { id: "house", label: "House", type: "house", x: 24, y: 34, w: 34, h: 38 }
                ],
                targetOrder: ["sun", "cloud", "house", "tree"],
                startOrder: ["tree", "sun", "house", "cloud"]
            },
            {
                title: "Harbor Day",
                layers: [
                    { id: "sun", label: "Sun", type: "sun", x: 65, y: 8, w: 22, h: 22 },
                    { id: "cloud", label: "Cloud", type: "cloud", x: 16, y: 12, w: 30, h: 20 },
                    { id: "boat", label: "Boat", type: "boat", x: 22, y: 50, w: 42, h: 22 },
                    { id: "fish", label: "Fish", type: "fish", x: 56, y: 58, w: 24, h: 14 }
                ],
                targetOrder: ["sun", "cloud", "fish", "boat"],
                startOrder: ["cloud", "boat", "sun", "fish"]
            },
            {
                title: "Park View",
                layers: [
                    { id: "cloud", label: "Cloud", type: "cloud", x: 52, y: 12, w: 30, h: 20 },
                    { id: "sun", label: "Sun", type: "sun", x: 12, y: 10, w: 22, h: 22 },
                    { id: "tree", label: "Tree", type: "tree", x: 20, y: 24, w: 24, h: 46 },
                    { id: "house", label: "House", type: "house", x: 42, y: 34, w: 34, h: 38 }
                ],
                targetOrder: ["cloud", "sun", "tree", "house"],
                startOrder: ["house", "tree", "cloud", "sun"]
            }
        ];

        const targetStage = document.getElementById("targetStage");
        const playerStage = document.getElementById("playerStage");
        const layerButtons = document.getElementById("layerButtons");
        const feedbackScreen = document.getElementById("feedbackScreen");
        const orderList = document.getElementById("orderList");
        const sceneValue = document.getElementById("sceneValue");
        const movesValue = document.getElementById("movesValue");
        const bestValue = document.getElementById("bestValue");
        const statusValue = document.getElementById("statusValue");
        const newSceneButton = document.getElementById("newSceneButton");
        const resetSceneButton = document.getElementById("resetSceneButton");
        const nextSceneButton = document.getElementById("nextSceneButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");

        let sceneIndex = 0;
        let currentScene = null;
        let playerOrder = [];
        let moves = 0;
        let bestMoves = Number(localStorage.getItem("kea-layer-stack-best") || "0");
        let solved = false;
        let activeLayerId = null;

        function getLayer(scene, id) {
            return scene.layers.find((layer) => layer.id === id);
        }

        function renderGround(stage) {
            const ground = document.createElement("div");
            ground.className = "stage-ground";
            stage.appendChild(ground);
        }

        function renderLayer(stage, scene, layerId, interactive) {
            const layer = getLayer(scene, layerId);
            const button = document.createElement(interactive ? "button" : "div");
            if (interactive) {
                button.type = "button";
                button.className = "stage-object stage-object--interactive";
                button.addEventListener("click", () => bringToFront(layer.id));
            } else {
                button.className = "stage-object";
            }

            button.style.left = `${layer.x}%`;
            button.style.top = `${layer.y}%`;
            button.style.width = `${layer.w}%`;
            button.style.height = `${layer.h}%`;
            button.style.zIndex = String((interactive ? playerOrder : currentScene.targetOrder).indexOf(layer.id) + 2);
            button.innerHTML = SHAPE_RENDERERS[layer.type](layer);
            if (interactive && activeLayerId === layer.id) button.classList.add("is-active");
            stage.appendChild(button);
        }

        function renderStage(stage, scene, order, interactive) {
            stage.innerHTML = "";
            renderGround(stage);
            order.forEach((layerId) => renderLayer(stage, scene, layerId, interactive));
        }

        function renderButtons() {
            layerButtons.innerHTML = "";
            playerOrder.forEach((layerId) => {
                const layer = getLayer(currentScene, layerId);
                const button = document.createElement("button");
                button.type = "button";
                button.className = "kea-button kea-button--secondary layer-button";
                button.textContent = layer.label;
                if (activeLayerId === layer.id) button.classList.add("active");
                button.addEventListener("click", () => bringToFront(layer.id));
                layerButtons.appendChild(button);
            });
        }

        function renderOrderList() {
            orderList.innerHTML = "";
            playerOrder.forEach((layerId, index) => {
                const layer = getLayer(currentScene, layerId);
                const line = document.createElement("span");
                line.textContent = `${index + 1}. ${layer.label}`;
                orderList.appendChild(line);
            });
        }

        function updateHud() {
            sceneValue.textContent = `${sceneIndex + 1}`;
            movesValue.textContent = String(moves);
            bestValue.textContent = bestMoves ? String(bestMoves) : "-";
            statusValue.textContent = solved ? "Match" : "Build";
            nextSceneButton.disabled = !solved;
        }

        function checkSolved() {
            solved = playerOrder.join("|") === currentScene.targetOrder.join("|");
            if (solved) {
                if (!bestMoves || moves < bestMoves) {
                    bestMoves = moves;
                    localStorage.setItem("kea-layer-stack-best", String(bestMoves));
                }
                feedbackScreen.innerHTML = `<strong>Matched</strong><p>You rebuilt the scene. Your order now matches the target.</p>`;
            } else {
                feedbackScreen.innerHTML = `<strong>Keep going</strong><p>Bring the object that should sit on top to the front of your scene.</p>`;
            }
            updateHud();
        }

        function redraw() {
            renderStage(targetStage, currentScene, currentScene.targetOrder, false);
            renderStage(playerStage, currentScene, playerOrder, true);
            renderButtons();
            renderOrderList();
            updateHud();
        }

        function bringToFront(layerId) {
            if (solved) return;
            const index = playerOrder.indexOf(layerId);
            if (index === -1) return;
            activeLayerId = layerId;
            playerOrder.splice(index, 1);
            playerOrder.push(layerId);
            moves += 1;
            redraw();
            checkSolved();
        }

        function loadScene(index) {
            sceneIndex = index;
            currentScene = SCENES[index];
            playerOrder = [...currentScene.startOrder];
            moves = 0;
            solved = false;
            activeLayerId = null;
            feedbackScreen.innerHTML = `<strong>${currentScene.title}</strong><p>Match the target scene by changing which object is in front.</p>`;
            redraw();
        }

        function nextScene() {
            loadScene((sceneIndex + 1) % SCENES.length);
        }

        newSceneButton.addEventListener("click", nextScene);
        nextSceneButton.addEventListener("click", nextScene);
        resetSceneButton.addEventListener("click", () => loadScene(sceneIndex));
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => {
            if (event.target === helpOverlay) helpOverlay.hidden = true;
        });

        loadScene(0);
