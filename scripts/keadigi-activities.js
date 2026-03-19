(function () {
  const activities = window.KEADigiActivities || {};

  function shuffle(items) {
    const clone = [...items];
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  function setFeedback(screen, title, body) {
    screen.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
  }

  function resolveChoices(deck, item) {
    if (Array.isArray(item.choices)) return item.choices;
    if (!deck.choicesById) return [];

    const ids = Array.isArray(item.choiceIds)
      ? item.choiceIds
      : [item.answerId, ...(item.distractorIds || [])];

    return ids.map((id) => deck.choicesById[id]).filter(Boolean);
  }

  activities.createMultipleChoiceActivity = function createMultipleChoiceActivity(config) {
    const { deck, elements } = config;

    if (!deck || !Array.isArray(deck.items) || !elements) {
      throw new Error("KEA Digi multiple-choice activity requires a deck and bound elements.");
    }

    const readyTitle = config.readyTitle || deck.readyTitle || "Ready";
    const readyBody = config.readyBody || deck.readyBody || "Choose the answer that matches the clue.";
    const correctTitle = config.correctTitle || deck.correctTitle || "Correct";
    const wrongTitle = config.wrongTitle || deck.wrongTitle || "Not this one";
    const renderChoice = config.renderChoice || ((choice) => choice.label);
    const getChoiceLabel = config.getChoiceLabel || ((choice) => choice.label || choice.id);
    const getPromptText = config.getPromptText || ((item) => item.prompt);
    const getFeedbackBody = config.getFeedbackBody || ((item) => item.detail || "");
    const decorateChoice = config.decorateChoice || (() => {});
    const choiceClassName = config.choiceClassName || "kea-button";

    let round = 1;
    let score = 0;
    let streak = 0;
    let answered = false;
    let currentItem = null;
    let availableItems = [];

    function updateHud() {
      if (elements.roundValue) elements.roundValue.textContent = String(round);
      if (elements.scoreValue) elements.scoreValue.textContent = String(score);
      if (elements.streakValue) elements.streakValue.textContent = String(streak);
    }

    function drawRound() {
      if (!availableItems.length) availableItems = shuffle(deck.items);

      answered = false;
      currentItem = availableItems.pop();

      const choices = shuffle(resolveChoices(deck, currentItem));

      updateHud();
      elements.promptText.textContent = getPromptText(currentItem);
      setFeedback(elements.feedbackScreen, readyTitle, readyBody);
      elements.nextButton.disabled = true;
      elements.choicesContainer.innerHTML = "";

      choices.forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = choiceClassName;
        button.dataset.choiceId = choice.id;
        button.setAttribute("aria-label", getChoiceLabel(choice));
        button.innerHTML = renderChoice(choice, currentItem);
        decorateChoice(button, choice, currentItem);
        button.addEventListener("click", () => handleChoice(button, choice));
        elements.choicesContainer.appendChild(button);
      });
    }

    function handleChoice(button, choice) {
      if (answered) return;

      answered = true;
      const isCorrect = choice.id === currentItem.answerId;
      const buttons = elements.choicesContainer.querySelectorAll("button");

      buttons.forEach((itemButton) => {
        itemButton.disabled = true;
        if (itemButton.dataset.choiceId === currentItem.answerId) {
          itemButton.classList.add("correct");
        }
      });

      if (isCorrect) {
        score += 1;
        streak += 1;
        button.classList.add("correct");
        setFeedback(elements.feedbackScreen, correctTitle, getFeedbackBody(currentItem, true, choice));
      } else {
        streak = 0;
        button.classList.add("wrong");
        setFeedback(elements.feedbackScreen, wrongTitle, getFeedbackBody(currentItem, false, choice));
      }

      updateHud();
      elements.nextButton.disabled = false;
    }

    function nextRound() {
      round += 1;
      drawRound();
    }

    function resetGame() {
      round = 1;
      score = 0;
      streak = 0;
      availableItems = shuffle(deck.items);
      drawRound();
    }

    elements.nextButton.addEventListener("click", nextRound);
    if (elements.resetButton) elements.resetButton.addEventListener("click", resetGame);

    resetGame();

    return {
      nextRound,
      resetGame
    };
  };

  window.KEADigiActivities = activities;
})();
