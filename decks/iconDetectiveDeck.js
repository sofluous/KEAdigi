(function () {
  window.KEADigiDecks = window.KEADigiDecks || {};

  window.KEADigiDecks.iconDetective = {
    id: "icon-detective",
    type: "multiple-choice",
    readyTitle: "Ready",
    readyBody: "Choose the icon that matches the clue.",
    correctTitle: "Correct",
    wrongTitle: "Not this one",
    choicesById: {
      settings: {
        id: "settings",
        label: "Settings",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="14"></circle><path d="M50 16v10M50 74v10M16 50h10M74 50h10M25 25l7 7M68 68l7 7M25 75l7-7M68 32l7-7"></path></svg>'
      },
      home: {
        id: "home",
        label: "Home",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 46L50 20l32 26"></path><path d="M28 42v38h44V42"></path><path d="M42 80V57h16v23"></path></svg>'
      },
      search: {
        id: "search",
        label: "Search",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="43" cy="43" r="23"></circle><path d="M60 60l20 20"></path></svg>'
      },
      save: {
        id: "save",
        label: "Save",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 18h42l10 10v54H24z"></path><path d="M34 18v22h28V18"></path><rect x="34" y="56" width="32" height="18"></rect></svg>'
      },
      print: {
        id: "print",
        label: "Print",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="28" y="18" width="44" height="18"></rect><rect x="22" y="36" width="56" height="26" rx="6"></rect><rect x="30" y="54" width="40" height="24"></rect><path d="M68 47h4"></path></svg>'
      },
      undo: {
        id: "undo",
        label: "Undo",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M38 30L20 48l18 18"></path><path d="M24 48h28c18 0 28 10 28 24"></path></svg>'
      },
      trash: {
        id: "trash",
        label: "Delete",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 30h40"></path><path d="M38 30v-8h24v8"></path><path d="M34 30l4 44h24l4-44"></path><path d="M44 40v24M56 40v24"></path></svg>'
      },
      zoom: {
        id: "zoom",
        label: "Zoom In",
        svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="43" cy="43" r="23"></circle><path d="M43 33v20M33 43h20M60 60l20 20"></path></svg>'
      }
    },
    items: [
      {
        id: "settings-clue",
        prompt: "Open settings.",
        answerId: "settings",
        distractorIds: ["home", "search", "save"],
        detail: "The gear icon usually opens app controls and preferences."
      },
      {
        id: "home-clue",
        prompt: "Go back to the home page.",
        answerId: "home",
        distractorIds: ["settings", "search", "print"],
        detail: "The house icon usually takes you to the main screen."
      },
      {
        id: "search-clue",
        prompt: "Look for something.",
        answerId: "search",
        distractorIds: ["save", "zoom", "home"],
        detail: "The magnifying glass helps you find files, pages, or information."
      },
      {
        id: "save-clue",
        prompt: "Save your work.",
        answerId: "save",
        distractorIds: ["print", "undo", "trash"],
        detail: "This icon means keep your changes."
      },
      {
        id: "print-clue",
        prompt: "Print the page.",
        answerId: "print",
        distractorIds: ["save", "trash", "home"],
        detail: "A printer icon sends a copy to paper."
      },
      {
        id: "undo-clue",
        prompt: "Undo the last change.",
        answerId: "undo",
        distractorIds: ["trash", "save", "settings"],
        detail: "Undo goes back one step after a mistake."
      },
      {
        id: "trash-clue",
        prompt: "Delete this item.",
        answerId: "trash",
        distractorIds: ["save", "print", "home"],
        detail: "The trash can usually removes something."
      },
      {
        id: "zoom-clue",
        prompt: "Make the view bigger.",
        answerId: "zoom",
        distractorIds: ["search", "save", "settings"],
        detail: "Zoom in makes the thing you are viewing appear larger."
      }
    ]
  };
})();
