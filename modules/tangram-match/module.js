        const board = document.getElementById('board'), pieces = document.getElementById('pieces'), timerDisplay = document.getElementById('timer'), comboWrap = document.getElementById('comboWrap'), comboFill = document.getElementById('comboFill'), comboCountDisplay = document.getElementById('comboCount'), levelPill = document.getElementById('levelPill'), modePill = document.getElementById('modePill'), typingPill = document.getElementById('typingPill'), startButton = document.getElementById('startButton'), helpButton = document.getElementById('helpButton'), closeHelpButton = document.getElementById('closeHelpButton'), helpOverlay = document.getElementById('helpOverlay');
        const TARGET_KEYS = ['1','2','3','4','5','6','7','8','9','0'], PIECE_KEYS = ['A','S','D','F','G','H','J','K','L','P'], SHAPE_TYPES = ['square','triangle','circle'];
        const COLORS = [{ key:'red', value:'#FF004D' },{ key:'green', value:'#00E436' },{ key:'blue', value:'#29ADFF' },{ key:'peach', value:'#FFCCAA' },{ key:'lavender', value:'#83769C' },{ key:'pink', value:'#FF77A8' },{ key:'orange', value:'#FFA300' },{ key:'purple', value:'#7E2553' },{ key:'brown', value:'#AB5236' },{ key:'grey', value:'#C2C3C7' }];
        let level = 1, currentRound = null, selectedPieceId = null, pendingTargetSlotId = null, pendingPieceId = null, heldTargetShortcut = null, heldPieceShortcut = null, startTime = 0, interval = null, comboCount = 0, comboDecayInterval = null, comboValue = 0, completingLevel = false;

        function shuffle(arr) { const clone = [...arr]; for (let i = clone.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [clone[i], clone[j]] = [clone[j], clone[i]]; } return clone; }
        function getLevelConfig(n) { const pieceCount = Math.min(n,10), colorMode = n >= 4, shapeMode = n >= 7, typingMode = n >= 3; return { pieceCount, colorMode, shapeMode, typingMode, colorCount: colorMode ? Math.min(1 + Math.floor((n - 4) / 2), Math.min(pieceCount, COLORS.length)) : 1, shapeCount: shapeMode ? Math.min(1 + Math.floor((n - 7) / 2), SHAPE_TYPES.length) : 1 }; }
        function buildRound(n) {
            const config = getLevelConfig(n), palette = COLORS.slice(0, config.colorCount), shapes = SHAPE_TYPES.slice(0, config.shapeCount), targets = [];
            for (let i = 0; i < config.pieceCount; i++) { const shapeType = shapes[i % shapes.length], color = palette[i % palette.length]; targets.push({ slotId: `slot-${n}-${i}`, shortcut: TARGET_KEYS[i], shapeType, colorKey: config.colorMode ? color.key : null, colorValue: config.colorMode ? color.value : '#C2C3C7' }); }
            const piecesForRound = shuffle(targets).map((target, index) => ({ id: `piece-${n}-${index}`, shortcut: PIECE_KEYS[index], shapeType: target.shapeType, colorKey: target.colorKey, colorValue: target.colorValue, slotId: null }));
            return { ...config, targets, pieces: piecesForRound };
        }
        function describeMode(config) { const parts = [`${config.pieceCount} ${config.pieceCount === 1 ? 'shape' : 'shapes'}`]; if (config.shapeMode) parts.push(`${config.shapeCount} forms`); if (config.colorMode) parts.push(`${config.colorCount} colors`); return parts.join(' | '); }
        function makeSvg(shapeType, fillValue, strokeValue, dashed, cls = '') {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); if (cls) svg.setAttribute('class', cls);
            let shape; if (shapeType === 'circle') { shape = document.createElementNS(svg.namespaceURI, 'circle'); shape.setAttribute('cx', 50); shape.setAttribute('cy', 50); shape.setAttribute('r', 42); } else if (shapeType === 'triangle') { shape = document.createElementNS(svg.namespaceURI, 'polygon'); shape.setAttribute('points', '50,8 92,90 8,90'); } else { shape = document.createElementNS(svg.namespaceURI, 'rect'); shape.setAttribute('x', 10); shape.setAttribute('y', 10); shape.setAttribute('width', 80); shape.setAttribute('height', 80); shape.setAttribute('rx', 8); }
            shape.setAttribute('fill', fillValue); shape.setAttribute('stroke', strokeValue); shape.setAttribute('stroke-width', 5); if (dashed) shape.setAttribute('stroke-dasharray', '8,5'); svg.appendChild(shape); return svg;
        }
        const getPieceById = (id) => currentRound.pieces.find((piece) => piece.id === id) || null;
        const getSlotById = (id) => currentRound.targets.find((slot) => slot.slotId === id) || null;
        const getSlotByShortcut = (key) => currentRound.targets.find((slot) => slot.shortcut === key) || null;
        const getPieceByShortcut = (key) => currentRound.pieces.find((piece) => piece.shortcut === key) || null;
        const getPieceInSlot = (slotId) => currentRound.pieces.find((piece) => piece.slotId === slotId) || null;
        const canPlacePieceOnSlot = (piece, slot) => piece.shapeType === slot.shapeType && (!slot.colorKey || piece.colorKey === slot.colorKey);

        function renderBoard() {
            board.innerHTML = ''; pieces.innerHTML = '';
            currentRound.targets.forEach((target) => {
                const tile = document.createElement('button'); tile.type = 'button'; tile.className = 'tile'; tile.dataset.slotId = target.slotId; tile.dataset.shortcut = target.shortcut; tile.appendChild(makeSvg(target.shapeType, 'rgba(255,255,255,0.06)', target.colorValue || '#111111', true, 'slot-template'));
                const badge = document.createElement('span'); badge.className = 'slot-badge'; badge.textContent = target.shortcut; tile.appendChild(badge);
                tile.addEventListener('dragover', (event) => { event.preventDefault(); const piece = getPieceById(event.dataTransfer.getData('text/plain')); if (!piece) return; tile.classList.toggle('highlight', canPlacePieceOnSlot(piece, target)); tile.classList.toggle('invalid', !canPlacePieceOnSlot(piece, target)); });
                tile.addEventListener('dragleave', () => tile.classList.remove('highlight', 'invalid'));
                tile.addEventListener('drop', (event) => { event.preventDefault(); tile.classList.remove('highlight', 'invalid'); const piece = getPieceById(event.dataTransfer.getData('text/plain')); if (piece) placePiece(piece.id, target.slotId, 'drag'); });
                tile.addEventListener('click', () => { if (selectedPieceId) placePiece(selectedPieceId, target.slotId, 'tap'); else { const occupant = getPieceInSlot(target.slotId); if (occupant) { selectPiece(occupant.id); movePieceToTray(occupant.id, false); } else setPendingTarget(target.slotId); } });
                board.appendChild(tile);
            });
            currentRound.pieces.forEach((piece) => pieces.appendChild(createPieceElement(piece)));
            syncBoardState(); fitBoardToViewport(); updateTypingHint(); updateShortcutBadges();
        }

        function createPieceElement(piece) {
            const el = document.createElement('button'); el.type = 'button'; el.className = 'shape'; el.dataset.pieceId = piece.id; el.dataset.shortcut = piece.shortcut; el.setAttribute('draggable', 'true'); el.appendChild(makeSvg(piece.shapeType, piece.colorValue, '#111111', false));
            const badge = document.createElement('span'); badge.className = 'piece-badge'; badge.textContent = piece.shortcut; el.appendChild(badge);
            el.addEventListener('click', () => { if (selectedPieceId === piece.id) { clearSelection(); clearTypingSelection(); } else { selectPiece(piece.id); setPendingPiece(piece.id); } });
            el.addEventListener('dragstart', (event) => { selectedPieceId = piece.id; el.classList.add('dragging'); event.dataTransfer.setData('text/plain', piece.id); });
            el.addEventListener('dragend', () => el.classList.remove('dragging'));
            return el;
        }

        function selectPiece(pieceId) { selectedPieceId = pieceId; document.querySelectorAll('.shape').forEach((el) => el.classList.toggle('selected', el.dataset.pieceId === pieceId)); }
        function clearSelection() { selectedPieceId = null; document.querySelectorAll('.shape').forEach((el) => el.classList.remove('selected')); document.querySelectorAll('.tile').forEach((tile) => tile.classList.remove('highlight', 'invalid')); }
        function clearTypingSelection() { pendingTargetSlotId = null; pendingPieceId = null; updateTypingHint(); updateShortcutBadges(); }
        function setPendingTarget(slotId) { pendingTargetSlotId = slotId; updateTypingHint(); updateShortcutBadges(); attemptKeyboardPlacement(); }
        function setPendingPiece(pieceId) { pendingPieceId = pieceId; updateTypingHint(); updateShortcutBadges(); attemptKeyboardPlacement(); }
        function updateTypingHint() {
            if (!currentRound || !currentRound.typingMode) { typingPill.textContent = 'Typing locked'; return; }
            const target = pendingTargetSlotId ? getSlotById(pendingTargetSlotId) : null, piece = pendingPieceId ? getPieceById(pendingPieceId) : null;
            typingPill.textContent = target && piece ? `${target.shortcut} + ${piece.shortcut}` : target ? `Target ${target.shortcut}` : piece ? `Piece ${piece.shortcut}` : 'Type 1 + A';
        }
        function updateShortcutBadges() {
            const typingMode = Boolean(currentRound && currentRound.typingMode);
            document.querySelectorAll('.tile, .shape').forEach((el) => el.classList.toggle('typing-mode', typingMode));
            document.querySelectorAll('.slot-badge').forEach((badge) => {
                const shortcut = badge.parentElement?.dataset.shortcut;
                const slotId = badge.parentElement?.dataset.slotId;
                badge.classList.toggle('active', typingMode && (shortcut === heldTargetShortcut || slotId === pendingTargetSlotId));
            });
            document.querySelectorAll('.piece-badge').forEach((badge) => {
                const shortcut = badge.parentElement?.dataset.shortcut;
                const pieceId = badge.parentElement?.dataset.pieceId;
                badge.classList.toggle('active', typingMode && (shortcut === heldPieceShortcut || pieceId === pendingPieceId));
            });
        }
        function movePieceToTray(pieceId, resetComboOnMove = true) { const piece = getPieceById(pieceId); if (!piece) return; piece.slotId = null; syncBoardState(); if (resetComboOnMove) resetCombo(); }
        function placementFx(slotId, pieceId) {
            const tile = document.querySelector(`.tile[data-slot-id="${slotId}"]`), piece = document.querySelector(`.shape[data-piece-id="${pieceId}"]`);
            if (tile) { tile.classList.add('spark'); setTimeout(() => tile.classList.remove('spark'), 260); }
            if (piece) { piece.classList.add('snap-pop'); setTimeout(() => piece.classList.remove('snap-pop'), 220); }
        }
        function placePiece(pieceId, slotId, source = 'tap') {
            if (completingLevel) return;
            const piece = getPieceById(pieceId), slot = getSlotById(slotId); if (!piece || !slot) return;
            if (!canPlacePieceOnSlot(piece, slot)) { if (source === 'typing') movePieceToTray(piece.id, false); flashInvalid(slotId); resetCombo(); clearTypingSelection(); return; }
            const occupyingPiece = getPieceInSlot(slotId); if (occupyingPiece && occupyingPiece.id !== piece.id) occupyingPiece.slotId = null;
            piece.slotId = slotId; clearSelection(); clearTypingSelection(); incrementCombo(); syncBoardState(); placementFx(slotId, pieceId); checkLevelComplete();
        }
        function attemptKeyboardPlacement() { if (pendingTargetSlotId && pendingPieceId) placePiece(pendingPieceId, pendingTargetSlotId, 'typing'); }
        function flashInvalid(slotId) { const tile = document.querySelector(`.tile[data-slot-id="${slotId}"]`); if (!tile) return; tile.classList.add('invalid'); setTimeout(() => tile.classList.remove('invalid'), 220); }
        function syncBoardState() {
            currentRound.targets.forEach((slot) => { const tile = document.querySelector(`.tile[data-slot-id="${slot.slotId}"]`), occupant = getPieceInSlot(slot.slotId); if (!tile) return; tile.classList.toggle('filled', Boolean(occupant)); tile.classList.toggle('complete', Boolean(occupant) && canPlacePieceOnSlot(occupant, slot)); });
            currentRound.pieces.forEach((piece) => {
                const el = document.querySelector(`.shape[data-piece-id="${piece.id}"]`); if (!el) return;
                if (piece.slotId) { const tile = document.querySelector(`.tile[data-slot-id="${piece.slotId}"]`); if (tile && el.parentElement !== tile) tile.appendChild(el); el.classList.add('placed'); }
                else if (el.parentElement !== pieces) { pieces.appendChild(el); el.classList.remove('placed'); }
                else el.classList.remove('placed');
            });
        }
        function checkLevelComplete() {
            const solved = currentRound.targets.every((slot) => { const piece = getPieceInSlot(slot.slotId); return piece && canPlacePieceOnSlot(piece, slot); });
            if (!solved) return;
            completingLevel = true; board.classList.add('board-complete'); clearInterval(interval);
            setTimeout(() => { board.classList.remove('board-complete'); level += 1; startGame(); }, 650);
        }
        function fitBoardToViewport() {
            const playArea = document.querySelector('.play-area'), availableHeight = playArea.clientHeight, availableWidth = playArea.clientWidth, pieceCount = currentRound ? currentRound.pieceCount : 1, perZoneHeight = Math.max(availableHeight / 2 - 62, 120), maxCols = Math.min(pieceCount, 5);
            let best = { cols: 1, size: 90 };
            for (let cols = 1; cols <= maxCols; cols++) {
                const rows = Math.ceil(pieceCount / cols), widthSize = (availableWidth - 32 - ((cols - 1) * 12)) / cols, heightSize = (perZoneHeight - 26 - ((rows - 1) * 12)) / rows, size = Math.floor(Math.min(widthSize, heightSize, 156));
                if (size > best.size) best = { cols, size };
            }
            document.documentElement.style.setProperty('--tile-columns', best.cols); document.documentElement.style.setProperty('--tile-size', `${Math.max(56, best.size)}px`);
        }
        function updateHud(config) { levelPill.textContent = `Level ${level}`; modePill.textContent = describeMode(config); typingPill.textContent = config.typingMode ? 'Type 1 + A' : 'Typing locked'; }
        function startTimer() {
            startTime = Date.now(); let lastSecond = 0; clearInterval(interval);
            interval = setInterval(() => {
                const elapsed = Date.now() - startTime, minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0'), seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0'), ms = (elapsed % 1000).toString().padStart(3, '0');
                timerDisplay.textContent = `${minutes}:${seconds}.${ms}`;
                const currentSecond = Math.floor(elapsed / 1000); if (currentSecond !== lastSecond) { timerDisplay.classList.add('pulse'); setTimeout(() => timerDisplay.classList.remove('pulse'), 180); lastSecond = currentSecond; }
            }, 33);
        }
        function updateComboDisplay() { comboFill.style.width = `${comboValue * 100}%`; comboCountDisplay.textContent = `Combo x${comboCount}`; comboWrap.classList.toggle('warning', comboValue > 0 && comboValue <= .45); comboWrap.classList.toggle('critical', comboValue > 0 && comboValue <= .2); }
        function incrementCombo() {
            comboCount += 1; comboValue = Math.min(comboValue + .18, 1); updateComboDisplay(); clearInterval(comboDecayInterval);
            comboDecayInterval = setInterval(() => { comboValue -= .01; if (comboValue <= 0) { comboValue = 0; comboCount = 0; clearInterval(comboDecayInterval); } updateComboDisplay(); }, 90);
        }
        function resetCombo() { comboCount = 0; comboValue = 0; clearInterval(comboDecayInterval); updateComboDisplay(); }
        function startGame() { completingLevel = false; selectedPieceId = null; pendingTargetSlotId = null; pendingPieceId = null; heldTargetShortcut = null; heldPieceShortcut = null; currentRound = buildRound(level); updateHud(currentRound); renderBoard(); startTimer(); }
        const normalizeTargetKey = (event) => event.code && event.code.startsWith('Digit') ? (event.code === 'Digit0' ? '0' : event.code.replace('Digit', '')) : null;
        const normalizePieceKey = (event) => { const key = (event.key || '').toUpperCase(); return PIECE_KEYS.includes(key) ? key : null; };

        pieces.addEventListener('dragover', (event) => event.preventDefault());
        pieces.addEventListener('drop', (event) => { event.preventDefault(); const pieceId = event.dataTransfer.getData('text/plain'); if (pieceId) movePieceToTray(pieceId); });
        startButton.addEventListener('click', () => { level = 1; resetCombo(); timerDisplay.textContent = '00:00.000'; startGame(); });
        helpButton.addEventListener('click', () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener('click', () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener('click', (event) => { if (event.target === helpOverlay) helpOverlay.hidden = true; });
        window.addEventListener('keydown', (event) => {
            if (!currentRound || !currentRound.typingMode || event.repeat) return;
            if (event.key === 'Escape') { heldTargetShortcut = null; heldPieceShortcut = null; clearSelection(); clearTypingSelection(); updateShortcutBadges(); return; }
            const targetShortcut = normalizeTargetKey(event); if (targetShortcut) { heldTargetShortcut = targetShortcut; updateShortcutBadges(); const slot = getSlotByShortcut(targetShortcut); if (slot) { setPendingTarget(slot.slotId); return; } }
            const pieceShortcut = normalizePieceKey(event); if (pieceShortcut) { heldPieceShortcut = pieceShortcut; updateShortcutBadges(); const piece = getPieceByShortcut(pieceShortcut); if (piece) { selectPiece(piece.id); setPendingPiece(piece.id); } }
        });
        window.addEventListener('keyup', (event) => {
            if (!currentRound || !currentRound.typingMode) return;
            const targetShortcut = normalizeTargetKey(event);
            const pieceShortcut = normalizePieceKey(event);
            if (targetShortcut && heldTargetShortcut === targetShortcut) heldTargetShortcut = null;
            if (pieceShortcut && heldPieceShortcut === pieceShortcut) heldPieceShortcut = null;
            updateShortcutBadges();
        });
        window.addEventListener('blur', () => { heldTargetShortcut = null; heldPieceShortcut = null; updateShortcutBadges(); });
        window.addEventListener('resize', () => { if (currentRound) fitBoardToViewport(); });
        window.addEventListener('load', () => { timerDisplay.textContent = '00:00.000'; updateComboDisplay(); currentRound = buildRound(level); updateHud(currentRound); renderBoard(); updateShortcutBadges(); });
