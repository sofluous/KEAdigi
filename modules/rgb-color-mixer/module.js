        let targetColor = { r: 0, g: 0, b: 0 };
        let attempts = 0;
        let totalSpeed = 0;
        let bestAccuracy = 0;
        let startTime = 0;
        let hasChecked = false;
        let hasStartedTest = false;

        function updateValue(color) {
            const slider = document.getElementById(color + 'Slider');
            const input = document.getElementById(color + 'Input');
            input.value = slider.value;
            updateMixedColor();
        }

        function changeValue(color, amount) {
            const slider = document.getElementById(color + 'Slider');
            let newValue = parseInt(slider.value, 10) + amount;
            if (newValue < 0) newValue = 0;
            if (newValue > 255) newValue = 255;
            slider.value = newValue;
            updateValue(color);
        }

        function validateInput(color) {
            const input = document.getElementById(color + 'Input');
            let value = parseInt(input.value, 10);
            if (isNaN(value) || value < 0) value = 0;
            if (value > 255) {
                value = 255;
                input.style.backgroundColor = '#ffcccc';
                setTimeout(() => { input.style.backgroundColor = ''; }, 300);
            }
            input.value = value;
            document.getElementById(color + 'Slider').value = value;
            updateValue(color);
        }

        function updateMixedColor() {
            const r = document.getElementById('rSlider').value;
            const g = document.getElementById('gSlider').value;
            const b = document.getElementById('bSlider').value;

            document.getElementById('mixedBox').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            document.getElementById('mixedValue').textContent = `R: ${r}, G: ${g}, B: ${b}`;
        }

        function applySliderGradients() {
            ['r', 'g', 'b'].forEach(color => {
                const slider = document.getElementById(color + 'Slider');
                slider.style.background = `linear-gradient(to right, black, ${color === 'r' ? '#ff004d' : color === 'g' ? '#00e436' : '#29adff'})`;
            });
        }

        function updateColorDisplay(color, value) {
            const display = document.getElementById(color + 'ColorDisplay');
            if (!display) return;
            if (color === 'r') display.style.backgroundColor = `rgb(${value},0,0)`;
            if (color === 'g') display.style.backgroundColor = `rgb(0,${value},0)`;
            if (color === 'b') display.style.backgroundColor = `rgb(0,0,${value})`;
        }

        function showInstructions() {
            document.getElementById('instructionBox').hidden = false;
        }

        function closeInstructions() {
            document.getElementById('instructionBox').hidden = true;
        }

        function startColorTest() {
            hasStartedTest = true;
            targetColor.r = Math.floor(Math.random() * 256);
            targetColor.g = Math.floor(Math.random() * 256);
            targetColor.b = Math.floor(Math.random() * 256);
            document.getElementById('randomBox').style.backgroundColor = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;
            document.getElementById('targetValue').textContent = 'R: ?, G: ?, B: ?';
            document.getElementById('resultText').textContent = '';
            document.getElementById('accuracyText').textContent = '';

            startTime = Date.now();
            hasChecked = false;
            updateButtonStates();
        }

        function confirmChoice() {
            const r = parseInt(document.getElementById('rSlider').value, 10);
            const g = parseInt(document.getElementById('gSlider').value, 10);
            const b = parseInt(document.getElementById('bSlider').value, 10);

            const diff = Math.abs(targetColor.r - r) + Math.abs(targetColor.g - g) + Math.abs(targetColor.b - b);
            const maxDiff = 3 * 255;
            const accuracy = ((maxDiff - diff) / maxDiff) * 100;
            const resultText = accuracy === 100 ? 'Perfect Match! 100% Accuracy!' : `Accuracy: ${accuracy.toFixed(1)}%`;
            document.getElementById('accuracyText').textContent = resultText;
            document.getElementById('targetValue').textContent = `R: ${targetColor.r}, G: ${targetColor.g}, B: ${targetColor.b}`;

            attempts++;
            const timeTaken = (Date.now() - startTime) / 1000;
            totalSpeed += timeTaken;
            if (accuracy > bestAccuracy) bestAccuracy = accuracy;

            document.getElementById('attempts').textContent = attempts;
            document.getElementById('avgSpeed').textContent = (totalSpeed / attempts).toFixed(2);
            document.getElementById('bestAccuracy').textContent = `${bestAccuracy.toFixed(1)}%`;
            hasChecked = true;
            updateButtonStates();
        }

        function resetAll() {
            ['r', 'g', 'b'].forEach(color => {
                document.getElementById(color + 'Slider').value = 0;
                document.getElementById(color + 'Input').value = 0;
                document.getElementById(color + 'Slider').style.background =
                    `linear-gradient(to right, black, ${color === 'r' ? '#ff004d' : color === 'g' ? '#00e436' : '#29adff'})`;
            });

            targetColor = { r: 0, g: 0, b: 0 };
            hasStartedTest = false;
            hasChecked = false;

            document.getElementById('randomBox').style.backgroundColor = '#ffffff';
            document.getElementById('targetValue').textContent = 'R: ?, G: ?, B: ?';
            document.getElementById('resultText').textContent = '';
            document.getElementById('mixedBox').style.backgroundColor = '#ffffff';
            document.getElementById('accuracyText').textContent = '';

            attempts = 0;
            totalSpeed = 0;
            bestAccuracy = 0;

            document.getElementById('attempts').textContent = 0;
            document.getElementById('avgSpeed').textContent = 0;
            document.getElementById('bestAccuracy').textContent = '0%';
            document.getElementById('resetButton').disabled = true;

            updateMixedColor();
            updateButtonStates();
        }

        function updateButtonStates() {
            const confirmButton = document.getElementById('confirmButton');
            const resetButton = document.getElementById('resetButton');
            const newColorButton = document.getElementById('newColorButton');

            confirmButton.disabled = !hasStartedTest || hasChecked;
            newColorButton.disabled = hasStartedTest && !hasChecked;
            resetButton.disabled = attempts === 0;
        }

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r') document.getElementById('rInput').focus();
            if (e.key.toLowerCase() === 'g') document.getElementById('gInput').focus();
            if (e.key.toLowerCase() === 'b') document.getElementById('bInput').focus();
            if (e.key === 'Escape') closeInstructions();
            if (document.activeElement && document.activeElement.classList.contains('rgb-input')) {
                const color = document.activeElement.id[0];
                if (e.key === 'ArrowLeft') changeValue(color, -1);
                if (e.key === 'ArrowRight') changeValue(color, 1);
                if (e.key === 'Enter' && !document.getElementById('confirmButton').disabled) confirmChoice();
            }
        });

        ['r', 'g', 'b'].forEach(color => {
            updateColorDisplay(color, 0);
            document.getElementById(color + 'Slider').style.background = `linear-gradient(to right, black, ${color === 'r' ? '#ff004d' : color === 'g' ? '#00e436' : '#29adff'})`;
        });

        window.onload = () => {
            applySliderGradients();
            updateMixedColor();
            updateButtonStates();
        };
