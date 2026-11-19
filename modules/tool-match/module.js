        const decks = window.KEADigiDecks;
        const toolSet = document.getElementById("toolSet");
        const roundValue = document.getElementById("roundValue");
        const scoreValue = document.getElementById("scoreValue");
        const streakValue = document.getElementById("streakValue");
        const promptText = document.getElementById("promptText");
        const toolGrid = document.getElementById("toolGrid");
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

        toolSet.value = "toolMatch";
        const activity = window.KEADigiActivities.createMultipleChoiceActivity({
            deck: decks.toolMatch,
            elements: {
                roundValue,
                scoreValue,
                streakValue,
                promptText,
                choicesContainer: toolGrid,
                feedbackScreen,
                nextButton,
                resetButton
            },
            choiceClassName: "kea-button tool-card",
            renderChoice(choice) {
                return `<span class="tool-card__badge">${choice.svg}</span><p class="tool-card__name">${choice.label}</p>`;
            }
        });
        let selectedSet = toolSet.value;
        toolSet.addEventListener("change", () => {
            try {
                activity.setDeck(decks[toolSet.value]);
                selectedSet = toolSet.value;
            } catch (error) {
                toolSet.value = selectedSet;
                feedbackScreen.textContent = error.message;
            }
        });
