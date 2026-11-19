        const frameCanvas = document.getElementById("frameCanvas"), ctx = frameCanvas.getContext("2d");
        const frameStageShell = frameCanvas.parentElement;
        const timelineStrip = document.getElementById("timelineStrip"), frameValue = document.getElementById("frameValue"), speedValue = document.getElementById("speedValue"), frameSetValue = document.getElementById("frameSetValue"), modeValue = document.getElementById("modeValue"), compareValue = document.getElementById("compareValue");
        const speedSlider = document.getElementById("speedSlider"), playPauseButton = document.getElementById("playPauseButton"), prevFrameButton = document.getElementById("prevFrameButton"), nextFrameButton = document.getElementById("nextFrameButton");
        const frameSetButtons = document.getElementById("frameSetButtons");
        const helpButton = document.getElementById("helpButton"), closeHelpButton = document.getElementById("closeHelpButton"), helpOverlay = document.getElementById("helpOverlay");
        const frameOptions = [6, 12, 24, 30, 60], playbackOptions = [6, 12, 24, 30, 60], thumbs = [];
        let currentFrame = 0, frameCount = 6, fps = 24, playing = false, playbackId = null;
        function bounceState(progress) {
            const travel = 110 + (progress * 560);
            const bounce = Math.abs(Math.sin(progress * Math.PI * 2.1));
            const hop = Math.sin(progress * Math.PI) ** 1.25;
            return {
                x: travel,
                y: 420 - (hop * 210) + (bounce * 18),
                squash: 1 - (Math.max(0, (yGround(progress) - (420 - (hop * 210))) / 90) * 0.12)
            };
        }
        function yGround() { return 470; }
        function frameProgress(index, total) { return total <= 1 ? 0 : index / (total - 1); }
        function smoothnessLabel() {
            if (frameCount >= 30 && fps >= 24) return "Smooth";
            if (frameCount >= 12 && fps >= 12) return "Balanced";
            return "Choppy";
        }
        function drawFrame(targetCtx, index, options = {}) {
            const onion = options.onion || false, thumb = options.thumb || false;
            const total = options.total || frameCount;
            const width = thumb ? 180 : 800, height = thumb ? 120 : 600, groundY = thumb ? 96 : 470, radius = thumb ? 15 : 70, xScale = thumb ? 180 / 800 : 1;
            const progress = frameProgress(index, total);
            const state = bounceState(progress);
            const x = state.x * xScale;
            const groundProgress = Math.max(0, (yGround() - state.y) / 90);
            const scaleX = 1 + (groundProgress * 0.18);
            const scaleY = 1 - (groundProgress * 0.16);
            const ballY = state.y * (thumb ? 120 / 600 : 1);
            targetCtx.clearRect(0, 0, width, height);
            const gradient = targetCtx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, onion ? "rgba(142,216,255,0.2)" : "#8ed8ff");
            gradient.addColorStop(1, onion ? "rgba(247,214,118,0.2)" : "#f7d676");
            targetCtx.fillStyle = gradient; targetCtx.fillRect(0, 0, width, height);
            targetCtx.fillStyle = onion ? "rgba(68,76,92,0.14)" : "#435168"; targetCtx.fillRect(0, groundY, width, height - groundY);
            targetCtx.save();
            targetCtx.translate(x, ballY);
            targetCtx.scale(scaleX, scaleY);
            targetCtx.beginPath(); targetCtx.arc(0, 0, radius, 0, Math.PI * 2); targetCtx.fillStyle = onion ? "rgba(255,93,77,0.18)" : "#ff5d4d"; targetCtx.fill();
            targetCtx.beginPath(); targetCtx.arc(-radius / 3, -radius / 3, radius / 4, 0, Math.PI * 2); targetCtx.fillStyle = onion ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.84)"; targetCtx.fill();
            targetCtx.restore();
        }
        function fitFrameCanvas() {
            const rect = frameStageShell.getBoundingClientRect();
            const availableWidth = Math.max(0, rect.width - 8);
            const availableHeight = Math.max(0, rect.height - 8);
            const aspectRatio = 4 / 3;
            let width = availableWidth;
            let height = width / aspectRatio;
            if (height > availableHeight) {
                height = availableHeight;
                width = height * aspectRatio;
            }
            frameCanvas.style.width = `${Math.floor(width)}px`;
            frameCanvas.style.height = `${Math.floor(height)}px`;
        }
        function renderStage() {
            ctx.clearRect(0, 0, 800, 600);
            if (currentFrame > 0) drawFrame(ctx, currentFrame - 1, { onion: true });
            drawFrame(ctx, currentFrame);
            frameValue.textContent = `${currentFrame + 1} / ${frameCount}`;
            speedValue.textContent = `${fps} fps`;
            frameSetValue.textContent = `${frameCount} frames`;
            modeValue.textContent = playing ? "Playing" : "Paused";
            compareValue.textContent = smoothnessLabel();
            thumbs.forEach((button, index) => button.classList.toggle("active", index === currentFrame));
        }
        function renderFrameSetButtons() {
            frameSetButtons.innerHTML = "";
            frameOptions.forEach((count) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "kea-button kea-button--secondary frame-set-button";
                button.textContent = String(count);
                if (count === frameCount) button.classList.add("is-active");
                button.setAttribute("aria-pressed", String(count === frameCount));
                button.addEventListener("click", () => {
                    stopPlayback();
                    frameCount = count;
                    currentFrame = 0;
                    renderFrameSetButtons();
                    renderTimeline();
                    renderStage();
                });
                frameSetButtons.appendChild(button);
            });
        }
        function renderTimeline() {
            timelineStrip.innerHTML = ""; thumbs.length = 0;
            timelineStrip.style.gridAutoColumns = frameCount > 24 ? "4rem" : frameCount > 12 ? "4.2rem" : "4.6rem";
            for (let index = 0; index < frameCount; index += 1) {
                const button = document.createElement("button");
                button.type = "button"; button.className = "kea-button kea-button--secondary frame-thumb";
                button.innerHTML = `<canvas class="frame-thumb-canvas" width="180" height="120"></canvas><p class="frame-thumb-label">Frame ${index + 1}</p>`;
                drawFrame(button.querySelector("canvas").getContext("2d"), index, { thumb: true, total: frameCount });
                button.addEventListener("click", () => { currentFrame = index; stopPlayback(); renderStage(); });
                timelineStrip.appendChild(button); thumbs.push(button);
            }
        }
        function stopPlayback() { playing = false; if (playbackId) { clearInterval(playbackId); playbackId = null; } playPauseButton.textContent = "Play"; renderStage(); }
        function startPlayback() { stopPlayback(); playing = true; playPauseButton.textContent = "Pause"; playbackId = setInterval(() => { currentFrame = (currentFrame + 1) % frameCount; renderStage(); }, Math.round(1000 / fps)); renderStage(); }
        playPauseButton.addEventListener("click", () => { if (playing) stopPlayback(); else startPlayback(); });
        prevFrameButton.addEventListener("click", () => { stopPlayback(); currentFrame = (currentFrame - 1 + frameCount) % frameCount; renderStage(); });
        nextFrameButton.addEventListener("click", () => { stopPlayback(); currentFrame = (currentFrame + 1) % frameCount; renderStage(); });
        speedSlider.addEventListener("input", () => { fps = playbackOptions[Number(speedSlider.value)] || 24; if (playing) startPlayback(); renderStage(); });
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        renderFrameSetButtons(); renderTimeline(); renderStage(); fitFrameCanvas();
        window.addEventListener("resize", fitFrameCanvas);
