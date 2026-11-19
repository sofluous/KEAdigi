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
    const heading = document.createElement("strong");
    const message = document.createElement("p");
    heading.textContent = title;
    message.textContent = body;
    screen.replaceChildren(heading, message);
  }

  function resolveChoices(deck, item) {
    if (Array.isArray(item.choices)) return item.choices;
    if (!deck.choicesById) return [];

    const ids = Array.isArray(item.choiceIds)
      ? item.choiceIds
      : [item.answerId, ...(item.distractorIds || [])];

    return ids.map((id) => Object.hasOwn(deck.choicesById, id) ? deck.choicesById[id] : null);
  }

  function validateDeck(deck) {
    if (!deck?.id || !Array.isArray(deck.items) || !deck.items.length) {
      throw new Error("This set needs an ID and at least one clue.");
    }
    const itemIds = new Set();
    for (const item of deck.items) {
      if (!item?.id || itemIds.has(item.id) || !item.prompt?.trim()) {
        throw new Error("Each clue needs a unique ID and prompt.");
      }
      itemIds.add(item.id);
      const choices = resolveChoices(deck, item);
      const choiceIds = new Set(choices.map((choice) => choice?.id));
      if (choices.length < 2 || choiceIds.size !== choices.length ||
          !choices.every((choice) => choice?.id && choice.label?.trim()) ||
          !choiceIds.has(item.answerId)) {
        throw new Error(`Clue ${item.id} needs distinct, labeled choices including its answer.`);
      }
    }
  }

  activities.createMultipleChoiceActivity = function createMultipleChoiceActivity(config) {
    const { elements } = config;
    let deck = config.deck;

    validateDeck(deck);

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
      setFeedback(elements.feedbackScreen,
        config.readyTitle || deck.readyTitle || "Ready",
        config.readyBody || deck.readyBody || "Choose the answer that matches the clue.");
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
      const shouldMoveFocus = document.activeElement === button;
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
        setFeedback(elements.feedbackScreen, config.correctTitle || deck.correctTitle || "Correct", getFeedbackBody(currentItem, true, choice));
      } else {
        streak = 0;
        button.classList.add("wrong");
        setFeedback(elements.feedbackScreen, config.wrongTitle || deck.wrongTitle || "Not this one", getFeedbackBody(currentItem, false, choice));
      }

      updateHud();
      elements.nextButton.disabled = false;
      if (shouldMoveFocus) elements.nextButton.focus();
    }

    function nextRound() {
      round += 1;
      drawRound();
      if (elements.promptText.hasAttribute("tabindex")) elements.promptText.focus();
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
      resetGame,
      setDeck(nextDeck) {
        validateDeck(nextDeck);
        deck = nextDeck;
        resetGame();
      }
    };
  };

  window.KEADigiActivities = activities;
})();
