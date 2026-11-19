        const deck = window.KEADigiDecks.iconDetective;
        const roundValue = document.getElementById("roundValue");
        const scoreValue = document.getElementById("scoreValue");
        const streakValue = document.getElementById("streakValue");
        const promptText = document.getElementById("promptText");
        const iconGrid = document.getElementById("iconGrid");
        const feedbackScreen = document.getElementById("feedbackScreen");
        const nextButton = document.getElementById("nextButton");
        const resetButton = document.getElementById("resetButton");
        const helpButton = document.getElementById("helpButton");
        const closeHelpButton = document.getElementById("closeHelpButton");
        const helpOverlay = document.getElementById("helpOverlay");
        helpButton.addEventListener("click", () => { helpOverlay.hidden = false; });
        closeHelpButton.addEventListener("click", () => { helpOverlay.hidden = true; });
        helpOverlay.addEventListener("click", (event) => {
            if (event.target === helpOverlay) helpOverlay.hidden = true;
        });

        window.KEADigiActivities.createMultipleChoiceActivity({
            deck,
            elements: {
                roundValue,
                scoreValue,
                streakValue,
                promptText,
                choicesContainer: iconGrid,
                feedbackScreen,
                nextButton,
                resetButton
            },
            choiceClassName: "kea-button icon-choice",
            renderChoice(choice) {
                return `<span class="icon-badge">${choice.svg}</span><p class="icon-name">${choice.label}</p>`;
            }
        });
